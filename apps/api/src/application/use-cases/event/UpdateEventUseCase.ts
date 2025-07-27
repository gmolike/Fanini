// apps/api/src/application/use-cases/event/UpdateEventUseCase.ts

import type { IEventRepository } from "@/domain/repositories/IEventRepository";
import type { IMemberRepository } from "@/domain/repositories/IMemberRepository";
import type { IApprovalRepository } from "@/domain/repositories/IApprovalRepository";
import type { AuditLogService } from "@/application/services/AuditLogService";
import type { UpdateEventDTO } from "@/application/dto/event";
import { isFieldEditableAfterApproval } from "@/application/dto/event";
import type { Event } from "@/domain/entities/Event";
import type { FieldChange } from "@/domain/entities/AuditLog";
import {
  createPermissionError,
  createBusinessError,
  createNotFoundError,
  ERROR_CODES,
} from "@/application/dto/common";

/**
 * Update Event Parameters
 */
export type UpdateEventParams = {
  /** Event ID */
  readonly id: string;
  /** Update Daten */
  readonly data: UpdateEventDTO;
  /** User ID */
  readonly userId: string;
  /** User Name */
  readonly userName?: string;
  /** User Rolle */
  readonly userRole: string;
  /** Request Context */
  readonly context?: {
    ipAddress?: string;
    userAgent?: string;
    sessionId?: string;
  };
};

/**
 * Update Event Result
 */
export type UpdateEventResult = {
  readonly success: boolean;
  readonly error?: any;
  readonly modifiedFields?: string[];
  readonly requiresApproval?: boolean;
  readonly approvalRequestId?: string;
};

/**
 * Update Event Use Case
 * @description Aktualisiert ein Event mit Berechtigungsprüfung und Audit Logging
 */
export type UpdateEventUseCase = {
  execute: (params: UpdateEventParams) => Promise<UpdateEventResult>;
};

/**
 * Factory für UpdateEventUseCase
 */
export const createUpdateEventUseCase = (
  eventRepository: IEventRepository,
  memberRepository: IMemberRepository,
  approvalRepository: IApprovalRepository,
  auditLogService: AuditLogService,
): UpdateEventUseCase => ({
  execute: async ({ id, data, userId, userName, userRole, context }) => {
    try {
      // 1. Event laden
      const event = await eventRepository.findById(id);
      if (!event) {
        return {
          success: false,
          error: createNotFoundError("Event", id),
        };
      }

      // 2. Berechtigungsprüfung
      const canEdit = canEditEvent(event, userId, userRole);
      if (!canEdit) {
        // Log unauthorized attempt
        await auditLogService.logAction({
          userId,
          userName,
          action: "rejected",
          entityType: "event",
          entityId: event.id,
          entityName: event.title,
          metadata: {
            reason: "insufficient_permissions",
            attemptedAction: "update",
            userRole,
          },
          context,
        });

        return {
          success: false,
          error: createPermissionError("Event bearbeiten", "Event"),
        };
      }

      // 3. Status-spezifische Einschränkungen
      if (event.status === "genehmigt" || event.status === "aktiv") {
        const updateFields = Object.keys(data) as Array<keyof UpdateEventDTO>;
        const restrictedFields = updateFields.filter(
          (field) => !isFieldEditableAfterApproval(field, userRole),
        );

        if (restrictedFields.length > 0) {
          // Log attempt to edit restricted fields
          await auditLogService.logAction({
            userId,
            userName,
            action: "rejected",
            entityType: "event",
            entityId: event.id,
            entityName: event.title,
            metadata: {
              reason: "restricted_fields",
              attemptedFields: restrictedFields,
              eventStatus: event.status,
            },
            context,
          });

          return {
            success: false,
            error: createBusinessError(
              `Folgende Felder können nach Genehmigung nicht mehr geändert werden: ${restrictedFields.join(", ")}`,
              ERROR_CODES.BUSINESS_RULE_VIOLATION,
              { restrictedFields },
            ),
          };
        }
      }

      // 4. Budget-Validierung
      if (data.budget !== undefined && userRole !== "VORSTAND") {
        await auditLogService.logAction({
          userId,
          userName,
          action: "rejected",
          entityType: "event",
          entityId: event.id,
          entityName: event.title,
          metadata: {
            reason: "budget_permission",
            attemptedBudget: data.budget,
            currentBudget: event.budget,
          },
          context,
        });

        return {
          success: false,
          error: createPermissionError("Budget ändern", "Event"),
        };
      }

      // 5. Stellvertreter validieren
      if (data.deputyMemberIds) {
        for (const deputyId of data.deputyMemberIds) {
          const deputy = await memberRepository.findById(deputyId);
          if (!deputy?.ist_aktiv) {
            return {
              success: false,
              error: createBusinessError(
                `Stellvertreter ${deputyId} ist kein aktives Mitglied`,
                ERROR_CODES.BUSINESS_RULE_VIOLATION,
                { deputyId },
              ),
            };
          }
        }
      }

      // 6. Änderungen sammeln für Audit Log
      const changes: FieldChange[] = [];
      const modifiedFields: string[] = [];
      const fieldsRequiringApproval: Array<{
        field: string;
        oldValue: any;
        newValue: any;
      }> = [];

      // Erstelle eine Kopie der Update-Daten mit korrekten Types
      const processedData: any = { ...data };

      // Parse Dates bevor wir sie vergleichen
      if (data.date) {
        processedData.date = new Date(data.date);
      }
      if (data.registrationDeadline) {
        processedData.registrationDeadline = new Date(
          data.registrationDeadline,
        );
      }

      // 7. Prüfe welche Felder Approval benötigen
      const needsApproval = await checkFieldsNeedApproval(
        event,
        processedData,
        userRole,
        approvalRepository,
      );

      for (const [field, newValue] of Object.entries(processedData)) {
        const oldValue = (event as any)[field];
        if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
          modifiedFields.push(field);

          const change: FieldChange = {
            field,
            oldValue,
            newValue,
            fieldType: typeof newValue,
          };
          changes.push(change);

          // Prüfe ob dieses Feld Approval benötigt
          if (needsApproval.includes(field)) {
            fieldsRequiringApproval.push({ field, oldValue, newValue });
          }
        }
      }

      // 8. Wenn Approval benötigt wird
      if (fieldsRequiringApproval.length > 0) {
        const approvalRequest = await approvalRepository.createRequest({
          requestType: "event_creation",
          resourceType: "event",
          resourceId: event.id,
          requestedBy: userId,
          oldData: fieldsRequiringApproval.reduce(
            (acc, f) => ({
              ...acc,
              [f.field]: f.oldValue,
            }),
            {},
          ),
          newData: fieldsRequiringApproval.reduce(
            (acc, f) => ({
              ...acc,
              [f.field]: f.newValue,
            }),
            {},
          ),
          changesSummary: `Event-Änderungen: ${fieldsRequiringApproval
            .map(
              (f) =>
                `${f.field}: ${JSON.stringify(f.oldValue)} → ${JSON.stringify(f.newValue)}`,
            )
            .join(", ")}`,
          priority: data.budget !== undefined ? "high" : "medium",
          dueDate: new Date(Date.now() + 48 * 60 * 60 * 1000), // 48h
        });

        // Log approval request creation
        await auditLogService.logAction({
          userId,
          userName,
          action: "created",
          entityType: "approval_request",
          entityId: approvalRequest.id,
          metadata: {
            forEntity: "event",
            forEntityId: event.id,
            fieldsRequiringApproval: fieldsRequiringApproval.map(
              (f) => f.field,
            ),
            priority: approvalRequest.priority,
          },
          context,
        });

        // Direkte Updates (die kein Approval brauchen)
        const directUpdates = Object.entries(processedData)
          .filter(
            ([field]) =>
              !fieldsRequiringApproval.find((f) => f.field === field),
          )
          .reduce((acc, [field, value]) => ({ ...acc, [field]: value }), {});

        if (Object.keys(directUpdates).length > 0) {
          await eventRepository.updateWithAudit(
            {
              ...event,
              ...directUpdates,
              updatedAt: new Date(),
              updatedBy: userId,
            },
            changes
              .filter(
                (c) =>
                  !fieldsRequiringApproval.find((f) => f.field === c.field),
              )
              .map((c) => ({
                eventId: event.id,
                action: "updated",
                fieldName: c.field,
                oldValue: JSON.stringify(c.oldValue),
                newValue: JSON.stringify(c.newValue),
                changedBy: userId,
                ipAddress: context?.ipAddress,
                userAgent: context?.userAgent,
              })),
          );
        }

        return {
          success: true,
          modifiedFields: Object.keys(directUpdates),
          requiresApproval: true,
          approvalRequestId: approvalRequest.id,
        };
      }

      // 9. Direkte Aktualisierung (kein Approval nötig)
      const updatedEvent: Event = {
        ...event,
        ...processedData,
        updatedAt: new Date(),
        updatedBy: userId,
      };

      // 10. Speichern mit Audit-Log
      await eventRepository.updateWithAudit(
        updatedEvent,
        changes.map((change) => ({
          eventId: event.id,
          action: "updated",
          fieldName: change.field,
          oldValue: JSON.stringify(change.oldValue),
          newValue: JSON.stringify(change.newValue),
          changedBy: userId,
          ipAddress: context?.ipAddress,
          userAgent: context?.userAgent,
        })),
      );

      // 11. Business-relevante Audit Logs
      if (changes.length > 0) {
        await auditLogService.logUpdate({
          userId,
          userName,
          action: "updated",
          entityType: "event",
          entityId: event.id,
          entityName: event.title,
          changes,
          metadata: {
            updateType: "direct",
            fieldCount: changes.length,
            significantChanges: identifySignificantChanges(changes),
          },
          context,
        });

        // Spezial-Log für kritische Änderungen
        if (data.budget !== undefined && data.budget !== event.budget) {
          await auditLogService.logAction({
            userId,
            userName,
            action: "updated",
            entityType: "event",
            entityId: event.id,
            entityName: event.title,
            metadata: {
              criticalChange: "budget",
              oldBudget: event.budget,
              newBudget: data.budget,
              difference: (data.budget || 0) - (event.budget || 0),
              percentageChange: event.budget
                ? (((data.budget || 0) - event.budget) / event.budget) * 100
                : null,
            },
            context,
          });
        }

        // Log für Status-Änderungen
        if (data.status && data.status !== event.status) {
          await auditLogService.logAction({
            userId,
            userName,
            action: "status_changed",
            entityType: "event",
            entityId: event.id,
            entityName: event.title,
            metadata: {
              workflow: "event_status",
              oldStatus: event.status,
              newStatus: data.status,
              changeReason: data.changeComment,
              statusDuration: event.updatedAt
                ? Date.now() - event.updatedAt.getTime()
                : null,
            },
            context,
          });

          // Benachrichtige bei Status-Änderungen
          if (data.status === "abgesagt") {
            await eventRepository.createStatusHistory({
              eventId: event.id,
              oldStatus: event.status,
              newStatus: data.status,
              changedBy: userId,
              comment: data.changeComment || "Event wurde abgesagt",
            });
          }
        }
      }

      return {
        success: true,
        modifiedFields,
      };
    } catch (error) {
      console.error("UpdateEventUseCase error:", error);

      // Log error
      await auditLogService.logAction({
        userId,
        userName,
        action: "rejected",
        entityType: "event",
        entityId: id,
        metadata: {
          error: (error as Error).message,
          errorType: "exception",
          attemptedChanges: Object.keys(data),
        },
        context,
      });

      return {
        success: false,
        error: createBusinessError(
          "Fehler beim Aktualisieren des Events",
          ERROR_CODES.SYSTEM_INTERNAL_ERROR,
        ),
      };
    }
  },
});

/**
 * Prüft ob User Event bearbeiten darf
 */
const canEditEvent = (
  event: any,
  userId: string,
  userRole: string,
): boolean => {
  // Admin darf alles
  if (userRole === "ADMIN") return true;

  // Beirat/Vorstand dürfen alle Events bearbeiten
  if (["BEIRAT", "VORSTAND"].includes(userRole)) return true;

  // Ersteller, Verantwortlicher oder Stellvertreter
  if (event.createdBy === userId) return true;
  if (event.responsibleMemberId === userId) return true;
  if (event.deputyMemberIds?.includes(userId)) return true;

  return false;
};

/**
 * Prüft welche Felder Approval benötigen
 */
const checkFieldsNeedApproval = async (
  event: any,
  updates: any,
  userRole: string,
  approvalRepository: IApprovalRepository,
): Promise<string[]> => {
  // Vorstand braucht nie Approval
  if (["VORSTAND", "ADMIN"].includes(userRole)) return [];

  const fieldsNeedingApproval: string[] = [];

  // Budget-Änderungen brauchen immer Approval (außer Vorstand)
  if (updates.budget !== undefined && updates.budget !== event.budget) {
    fieldsNeedingApproval.push("budget");
  }

  // Datum-Änderungen bei genehmigten Events
  if (
    event.status === "genehmigt" &&
    updates.date &&
    new Date(updates.date).getTime() !== event.date.getTime()
  ) {
    fieldsNeedingApproval.push("date");
  }

  // Status-Änderungen zu "genehmigt"
  if (updates.status === "genehmigt" && event.status !== "genehmigt") {
    fieldsNeedingApproval.push("status");
  }

  return fieldsNeedingApproval;
};

/**
 * Identifiziert signifikante Änderungen für Audit Log
 */
const identifySignificantChanges = (changes: FieldChange[]): string[] => {
  const significantFields = [
    "budget",
    "date",
    "status",
    "responsibleMemberId",
    "isPublic",
  ];
  return changes
    .filter((c) => significantFields.includes(c.field))
    .map((c) => c.field);
};

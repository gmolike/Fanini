// apps/api/src/application/use-cases/event/UpdateEventUseCase.ts

import type { IEventRepository } from "@/domain/repositories/IEventRepository";
import type { IMemberRepository } from "@/domain/repositories/IMemberRepository";
import type { UpdateEventDTO } from "@/application/dto/event";
import { isFieldEditableAfterApproval } from "@/application/dto/event";
import type { Event } from "@/domain/entities/Event";
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
  /** User Rolle */
  readonly userRole: string;
};

/**
 * Update Event Result
 */
export type UpdateEventResult = {
  readonly success: boolean;
  readonly error?: any;
  readonly modifiedFields?: string[];
};

/**
 * Update Event Use Case
 * @description Aktualisiert ein Event mit Berechtigungsprüfung
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
): UpdateEventUseCase => ({
  execute: async ({ id, data, userId, userRole }) => {
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
        return {
          success: false,
          error: createPermissionError("Event bearbeiten", "Event"),
        };
      }

      // 3. Status-spezifische Einschränkungen
      if (event.status === "genehmigt" || event.status === "aktiv") {
        // Prüfe welche Felder nach Genehmigung geändert werden dürfen
        const updateFields = Object.keys(data) as Array<keyof UpdateEventDTO>;
        const restrictedFields = updateFields.filter(
          (field) => !isFieldEditableAfterApproval(field, userRole),
        );

        if (restrictedFields.length > 0) {
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

      // 6. Audit-Einträge erstellen
      const auditEntries = [];
      const modifiedFields = [];

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

      for (const [field, newValue] of Object.entries(processedData)) {
        const oldValue = (event as any)[field];
        if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
          modifiedFields.push(field);
          auditEntries.push({
            eventId: event.id,
            action: "updated" as const,
            fieldName: field,
            oldValue: JSON.stringify(oldValue),
            newValue: JSON.stringify(newValue),
            changedBy: userId,
          });
        }
      }

      // 7. Event aktualisieren
      const updatedEvent: Event = {
        ...event,
        ...processedData, // Verwende processedData statt data
        updatedAt: new Date(),
        updatedBy: userId,
      };

      // 8. Speichern mit Audit-Log
      await eventRepository.updateWithAudit(updatedEvent, auditEntries);

      return {
        success: true,
        modifiedFields,
      };
    } catch (error) {
      console.error("UpdateEventUseCase error:", error);
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

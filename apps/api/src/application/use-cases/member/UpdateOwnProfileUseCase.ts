// apps/api/src/application/use-cases/member/UpdateOwnProfileUseCase.ts

import type { IMemberRepository } from "@/domain/repositories/IMemberRepository";
import type { IBenachrichtigungRepository } from "@/domain/repositories/IBenachrichtigungRepository";
import type { IApprovalRepository } from "@/domain/repositories/IApprovalRepository";
import type { AuditLogService } from "@/application/services/AuditLogService";
import type { UpdateMemberDTO } from "@/application/dto/member";
import type { FieldChange } from "@/domain/entities/AuditLog";
import { createBenachrichtigung } from "@/domain/entities/Benachrichtigung";
import {
  createValidationError,
  createBusinessError,
  ERROR_CODES,
} from "@/application/dto/common";

/**
 * Update Own Profile Parameters
 */
export type UpdateOwnProfileParams = {
  /** User ID */
  readonly userId: string;
  /** User Name */
  readonly userName?: string;
  /** Member ID */
  readonly memberId: string;
  /** Update Daten */
  readonly data: UpdateMemberDTO;
  /** Request Context */
  readonly context?: {
    ipAddress?: string;
    userAgent?: string;
    sessionId?: string;
  };
};

/**
 * Update Own Profile Result
 */
export type UpdateOwnProfileResult = {
  readonly success: boolean;
  readonly error?: any;
  readonly updatedFields?: string[];
  readonly notificationSent?: boolean;
  readonly requiresApproval?: boolean;
  readonly approvalRequestId?: string;
};

/**
 * Update Own Profile Use Case
 * @description Erlaubt Mitgliedern ihr eigenes Profil zu aktualisieren mit Audit Logging
 */
export type UpdateOwnProfileUseCase = {
  execute: (params: UpdateOwnProfileParams) => Promise<UpdateOwnProfileResult>;
};

/**
 * Factory für UpdateOwnProfileUseCase
 */
export const createUpdateOwnProfileUseCase = (
  memberRepository: IMemberRepository,
  benachrichtigungRepository: IBenachrichtigungRepository,
  approvalRepository: IApprovalRepository,
  auditLogService: AuditLogService,
): UpdateOwnProfileUseCase => ({
  execute: async ({ userId, userName, memberId, data, context }) => {
    try {
      // 1. Lade Mitglied
      const member = await memberRepository.findById(memberId);
      if (!member) {
        // Log attempt to update non-existent member
        await auditLogService.logAction({
          userId,
          userName,
          action: "rejected",
          entityType: "member",
          entityId: memberId,
          metadata: {
            reason: "member_not_found",
            attemptedAction: "update_profile",
          },
          context,
        });

        return {
          success: false,
          error: createBusinessError("Mitglied nicht gefunden"),
        };
      }

      // 2. Prüfe ob es das eigene Profil ist
      if (member.user_id !== userId) {
        // Log unauthorized attempt
        await auditLogService.logAction({
          userId,
          userName,
          action: "rejected",
          entityType: "member",
          entityId: memberId,
          entityName: `${member.vorname} ${member.nachname}`,
          metadata: {
            reason: "not_own_profile",
            attemptedAction: "update_profile",
            targetUserId: member.user_id,
          },
          context,
        });

        return {
          success: false,
          error: createBusinessError(
            "Nur eigenes Profil kann bearbeitet werden",
          ),
        };
      }

      // 3. Validierung
      if (data.email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
          return {
            success: false,
            error: createValidationError("email", "Ungültige E-Mail-Adresse"),
          };
        }

        // Prüfe ob E-Mail bereits verwendet wird
        const existingMember = await memberRepository.findAll({
          search: data.email,
        });
        if (
          existingMember.some(
            (m) => m.id !== memberId && m.email === data.email,
          )
        ) {
          return {
            success: false,
            error: createValidationError(
              "email",
              "E-Mail-Adresse wird bereits verwendet",
            ),
          };
        }
      }

      // 4. Sammle Änderungen für Audit Log
      const changes: FieldChange[] = [];
      const updatedFields: string[] = [];
      const sensitiveFields = ["email", "phone", "address", "birthdate"];
      const updatedSensitiveFields: Array<{
        field: string;
        oldValue: any;
        newValue: any;
      }> = [];
      const fieldsRequiringApproval: Array<{
        field: string;
        oldValue: any;
        newValue: any;
      }> = [];

      // Prüfe welche Felder geändert werden
      for (const [field, newValue] of Object.entries(data)) {
        if (newValue !== undefined) {
          const oldValue = member[field];

          // Skip wenn keine echte Änderung
          if (JSON.stringify(oldValue) === JSON.stringify(newValue)) {
            continue;
          }

          updatedFields.push(field);

          const change: FieldChange = {
            field,
            oldValue,
            newValue,
            fieldType: typeof newValue,
          };
          changes.push(change);

          // Prüfe ob sensitiv
          if (sensitiveFields.includes(field)) {
            updatedSensitiveFields.push({ field, oldValue, newValue });
          }

          // Prüfe ob Approval benötigt (z.B. für bestimmte kritische Felder)
          if (
            await fieldNeedsApproval(
              field,
              member,
              newValue,
              approvalRepository,
            )
          ) {
            fieldsRequiringApproval.push({ field, oldValue, newValue });
          }
        }
      }

      // 5. Wenn keine Änderungen
      if (updatedFields.length === 0) {
        return {
          success: true,
          updatedFields: [],
        };
      }

      // 6. Wenn Approval benötigt wird
      if (fieldsRequiringApproval.length > 0) {
        const approvalRequest = await approvalRepository.createRequest({
          requestType: "member_edit",
          resourceType: "member",
          resourceId: memberId,
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
          changesSummary: `Profil-Änderungen: ${fieldsRequiringApproval
            .map(
              (f) =>
                `${f.field}: ${maskSensitiveValue(f.field, f.oldValue)} → ${maskSensitiveValue(f.field, f.newValue)}`,
            )
            .join(", ")}`,
          priority: "medium",
          dueDate: new Date(Date.now() + 72 * 60 * 60 * 1000), // 72h
        });

        // Log approval request
        await auditLogService.logAction({
          userId,
          userName,
          action: "created",
          entityType: "approval_request",
          entityId: approvalRequest.id,
          metadata: {
            forEntity: "member",
            forEntityId: memberId,
            fieldsRequiringApproval: fieldsRequiringApproval.map(
              (f) => f.field,
            ),
            requestType: "self_update",
          },
          context,
        });

        // Direkte Updates (die kein Approval brauchen)
        const directUpdates = Object.entries(data)
          .filter(
            ([field, value]) =>
              value !== undefined &&
              !fieldsRequiringApproval.find((f) => f.field === field),
          )
          .reduce((acc, [field, value]) => ({ ...acc, [field]: value }), {});

        if (Object.keys(directUpdates).length > 0) {
          await memberRepository.update(memberId, {
            ...directUpdates,
            aktualisiert_am: new Date(),
          });

          // Log direkte Updates
          await auditLogService.logUpdate({
            userId,
            userName,
            action: "updated",
            entityType: "member",
            entityId: memberId,
            entityName: `${member.vorname} ${member.nachname}`,
            changes: changes.filter(
              (c) => !fieldsRequiringApproval.find((f) => f.field === c.field),
            ),
            metadata: {
              updateType: "partial_direct",
              source: "self_update",
              approvalPending: true,
            },
            context,
          });
        }

        return {
          success: true,
          updatedFields: Object.keys(directUpdates),
          requiresApproval: true,
          approvalRequestId: approvalRequest.id,
        };
      }

      // 7. Update durchführen (kein Approval nötig)
      await memberRepository.update(memberId, {
        ...data,
        aktualisiert_am: new Date(),
      });

      // 8. Audit Log für Update
      await auditLogService.logUpdate({
        userId,
        userName,
        action: "updated",
        entityType: "member",
        entityId: memberId,
        entityName: `${member.vorname} ${member.nachname}`,
        changes,
        metadata: {
          updateType: "self_update",
          fieldCount: changes.length,
          sensitiveFieldsUpdated: updatedSensitiveFields.map((f) => f.field),
          visibilitySettings: member.sichtbarkeit_email
            ? {
                email: member.sichtbarkeit_email,
                phone: member.sichtbarkeit_telefon,
                profile: member.sichtbarkeit_profil,
              }
            : undefined,
        },
        context,
      });

      // 9. Benachrichtigung an Beirat/Vorstand bei sensitiven Änderungen
      let notificationSent = false;
      if (updatedSensitiveFields.length > 0) {
        // Finde alle Beirat/Vorstand Mitglieder
        const leadershipMembers = await memberRepository.findAll({
          roleId: "BEIRAT,VORSTAND",
        });

        const changesSummary = updatedSensitiveFields
          .map(
            ({ field, oldValue, newValue }) =>
              `${field}: ${maskSensitiveValue(field, oldValue)} → ${maskSensitiveValue(field, newValue)}`,
          )
          .join("\n");

        // Erstelle Benachrichtigungen
        const notificationPromises = leadershipMembers.map(async (leader) => {
          const benachrichtigung = createBenachrichtigung({
            empfaengerId: leader.user_id,
            typ: "system",
            titel: "Mitgliedsdaten geändert",
            nachricht: `${member.vorname} ${member.nachname} hat sensitive Daten geändert:\n${changesSummary}`,
            kontextTyp: "member",
            kontextId: memberId,
            prioritaet: updatedSensitiveFields.some((f) => f.field === "email")
              ? "hoch"
              : "medium",
          });

          return benachrichtigungRepository.create(benachrichtigung);
        });

        await Promise.all(notificationPromises);
        notificationSent = true;

        // Log notification sending
        await auditLogService.logAction({
          userId,
          userName,
          action: "created",
          entityType: "member",
          entityId: memberId,
          entityName: `${member.vorname} ${member.nachname}`,
          metadata: {
            action: "notifications_sent",
            recipientCount: leadershipMembers.length,
            reason: "sensitive_data_changed",
            changedFields: updatedSensitiveFields.map((f) => f.field),
          },
          context,
        });
      }

      // 10. Spezielle Logs für kritische Änderungen
      if (data.email && data.email !== member.email) {
        await auditLogService.logAction({
          userId,
          userName,
          action: "updated",
          entityType: "member",
          entityId: memberId,
          entityName: `${member.vorname} ${member.nachname}`,
          metadata: {
            criticalChange: "email",
            oldEmail: maskEmail(member.email),
            newEmail: maskEmail(data.email),
            verificationRequired: true,
          },
          context,
        });
      }

      return {
        success: true,
        updatedFields,
        notificationSent,
      };
    } catch (error) {
      console.error("UpdateOwnProfileUseCase error:", error);

      // Log error
      await auditLogService.logAction({
        userId,
        userName,
        action: "rejected",
        entityType: "member",
        entityId: memberId,
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
          "Fehler beim Aktualisieren des Profils",
          ERROR_CODES.SYSTEM_INTERNAL_ERROR,
        ),
      };
    }
  },
});

/**
 * Prüft ob ein Feld Approval benötigt
 */
const fieldNeedsApproval = async (
  field: string,
  member: any,
  newValue: any,
  approvalRepository: IApprovalRepository,
): Promise<boolean> => {
  // Diese Felder benötigen immer Approval bei Selbst-Updates
  const alwaysNeedApproval = ["mitgliedsnummer", "easyverein_id"];
  if (alwaysNeedApproval.includes(field)) {
    return true;
  }

  // Besondere Regeln für bestimmte Felder
  if (field === "email" && member.auth_source === "easyverein") {
    // EasyVerein-synchronisierte E-Mails brauchen Approval
    return true;
  }

  return false;
};

/**
 * Maskiert sensitive Werte für Logs
 */
const maskSensitiveValue = (field: string, value: any): string => {
  if (!value) return "[leer]";

  switch (field) {
    case "email":
      return maskEmail(String(value));
    case "phone":
      return maskPhone(String(value));
    case "birthdate":
      return "[DATUM]";
    case "address":
      return "[ADRESSE]";
    default:
      return String(value);
  }
};

/**
 * Maskiert E-Mail-Adressen
 */
const maskEmail = (email: string): string => {
  if (!email?.includes("@")) return email;
  const [local, domain] = email.split("@");
  return `${local.substring(0, 2)}***@${domain}`;
};

/**
 * Maskiert Telefonnummern
 */
const maskPhone = (phone: string): string => {
  if (!phone || phone.length < 6) return phone;
  return phone.substring(0, 3) + "***" + phone.substring(phone.length - 2);
};

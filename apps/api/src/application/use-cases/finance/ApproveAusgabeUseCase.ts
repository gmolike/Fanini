// apps/api/src/application/use-cases/finance/ApproveAusgabeUseCase.ts

import type { IAusgabenRepository } from "@/domain/repositories/IAusgabenRepository";
import type { IEventRepository } from "@/domain/repositories/IEventRepository";
import type { IBenachrichtigungRepository } from "@/domain/repositories/IBenachrichtigungRepository";
import type { AuditLogService } from "@/application/services/AuditLogService";
import type { ApproveAusgabeDTO } from "@/application/dto/finance";
import { createBenachrichtigung } from "@/domain/entities/Benachrichtigung";
import {
  createPermissionError,
  createBusinessError,
  createNotFoundError,
} from "@/application/dto/common";

/**
 * Approve Ausgabe Parameters
 * @description Parameter für Ausgaben-Genehmigung
 */
export type ApproveAusgabeParams = {
  readonly ausgabeId: string;
  readonly data: ApproveAusgabeDTO;
  readonly userId: string;
  readonly userRole: string;
  readonly userName?: string;
  readonly context?: {
    readonly ipAddress?: string;
    readonly userAgent?: string;
    readonly sessionId?: string;
  };
};

/**
 * Approve Ausgabe Result
 * @description Ergebnis der Ausgaben-Genehmigung
 */
export type ApproveAusgabeResult = {
  readonly success: boolean;
  readonly error?: any;
  readonly budgetRemaining?: number;
};

/**
 * Approve Ausgabe Use Case
 * @description Genehmigt eine Ausgabe (nur Vorstand)
 */
export type ApproveAusgabeUseCase = {
  execute: (params: ApproveAusgabeParams) => Promise<ApproveAusgabeResult>;
};

/**
 * Factory für ApproveAusgabeUseCase
 */
export const createApproveAusgabeUseCase = (
  ausgabenRepository: IAusgabenRepository,
  eventRepository: IEventRepository,
  benachrichtigungRepository: IBenachrichtigungRepository,
  auditLogService: AuditLogService,
): ApproveAusgabeUseCase => ({
  execute: async ({ ausgabeId, data, userId, userRole, userName, context }) => {
    try {
      // 1. Rollenprüfung - NUR Vorstand
      if (userRole !== "VORSTAND" && userRole !== "ADMIN") {
        await auditLogService.logAction({
          userId,
          userName,
          action: "rejected",
          entityType: "finance",
          entityId: ausgabeId,
          metadata: {
            reason: "insufficient_permissions",
            requiredRole: "VORSTAND",
            userRole,
          },
          context,
        });

        return {
          success: false,
          error: createPermissionError("genehmigen", "Ausgaben"),
        };
      }

      // 2. Ausgabe laden
      const ausgabe = await ausgabenRepository.findById(ausgabeId, userId);
      if (!ausgabe) {
        return {
          success: false,
          error: createNotFoundError("Ausgabe", ausgabeId),
        };
      }

      // 3. Status prüfen
      if (ausgabe.status !== "eingereicht") {
        return {
          success: false,
          error: createBusinessError(
            `Ausgabe kann nicht genehmigt werden (Status: ${ausgabe.status})`,
          ),
        };
      }

      // 4. Event laden für Budget-Update
      const event = await eventRepository.findById(ausgabe.eventId);
      if (!event) {
        return {
          success: false,
          error: createBusinessError("Zugehöriges Event nicht gefunden"),
        };
      }

      // 5. Finaler Betrag bestimmen
      const finalAmount = data.adjustedAmount || ausgabe.betrag;
      const amountChanged = finalAmount !== ausgabe.betrag;

      // 6. Budget-Check bei Anpassung
      if (amountChanged && event.budget) {
        const currentTotal = await ausgabenRepository.getTotalByEvent(event.id);
        const newTotal = currentTotal - ausgabe.betrag + finalAmount;

        if (newTotal > event.budget * 1.2) {
          return {
            success: false,
            error: createBusinessError(
              "Angepasster Betrag würde Budget um mehr als 20% überschreiten",
            ),
          };
        }
      }

      // 7. Sammle Änderungen für Audit
      const changes = [];
      if (amountChanged) {
        changes.push({
          field: "betrag",
          oldValue: ausgabe.betrag,
          newValue: finalAmount,
        });
      }

      // 8. Ausgabe genehmigen
      const updatedAusgabe = await ausgabenRepository.update(
        ausgabeId,
        {
          status: "genehmigt",
          genehmigtVon: userId,
          genehmigtAm: new Date(),
          betrag: finalAmount,
        },
        userId,
      );

      // 9. Event Budget aktualisieren
      const newBudgetUsed = event.budgetUsed + finalAmount;
      await eventRepository.save({
        ...event,
        budgetUsed: newBudgetUsed,
        updatedAt: new Date(),
        updatedBy: userId,
      });

      // 10. Audit Log
      await auditLogService.logAction({
        userId,
        userName,
        action: "approved",
        entityType: "finance",
        entityId: ausgabeId,
        entityName: `Ausgabe: ${ausgabe.beschreibung}`,
        metadata: {
          eventId: event.id,
          eventTitle: event.title,
          originalAmount: ausgabe.betrag,
          approvedAmount: finalAmount,
          amountAdjusted: amountChanged,
          approvalComment: data.approvalComment,
          budgetStatus: {
            used: newBudgetUsed,
            total: event.budget || 0,
            percentage: event.budget
              ? Math.round((newBudgetUsed / event.budget) * 100)
              : null,
          },
          changes,
        },
        context,
      });

      // 11. Benachrichtigung an Einreicher
      const benachrichtigung = createBenachrichtigung({
        empfaengerId: ausgabe.eingereichtVon,
        typ: "genehmigung_erteilt",
        titel: "Ausgabe genehmigt",
        nachricht: amountChanged
          ? `Ihre Ausgabe "${ausgabe.beschreibung}" wurde mit angepasstem Betrag (${finalAmount}€ statt ${ausgabe.betrag}€) genehmigt.`
          : `Ihre Ausgabe "${ausgabe.beschreibung}" wurde genehmigt.`,
        kontextTyp: "ausgabe",
        kontextId: ausgabeId,
        prioritaet: "medium",
      });

      await benachrichtigungRepository.create(benachrichtigung);

      return {
        success: true,
        budgetRemaining: event.budget
          ? event.budget - newBudgetUsed
          : undefined,
      };
    } catch (error) {
      console.error("ApproveAusgabeUseCase error:", error);

      await auditLogService.logAction({
        userId,
        userName,
        action: "rejected",
        entityType: "finance",
        entityId: ausgabeId,
        metadata: {
          error: (error as Error).message,
          errorType: "exception",
        },
        context,
      });

      return {
        success: false,
        error: createBusinessError("Fehler beim Genehmigen der Ausgabe"),
      };
    }
  },
});

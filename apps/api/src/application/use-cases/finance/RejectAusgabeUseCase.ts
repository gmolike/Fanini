// apps/api/src/application/use-cases/finance/RejectAusgabeUseCase.ts

import type { IAusgabenRepository } from "@/domain/repositories/IAusgabenRepository";
import type { IBenachrichtigungRepository } from "@/domain/repositories/IBenachrichtigungRepository";
import type { AuditLogService } from "@/application/services/AuditLogService";
import type { RejectAusgabeDTO } from "@/application/dto/finance";
import { createBenachrichtigung } from "@/domain/entities/Benachrichtigung";
import {
  createPermissionError,
  createBusinessError,
  createNotFoundError,
  createValidationError,
} from "@/application/dto/common";

/**
 * Reject Ausgabe Parameters
 * @description Parameter für Ausgaben-Ablehnung
 */
export type RejectAusgabeParams = {
  readonly ausgabeId: string;
  readonly data: RejectAusgabeDTO;
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
 * Reject Ausgabe Result
 * @description Ergebnis der Ausgaben-Ablehnung
 */
export type RejectAusgabeResult = {
  readonly success: boolean;
  readonly error?: any;
};

/**
 * Reject Ausgabe Use Case
 * @description Lehnt eine Ausgabe ab (nur Vorstand)
 */
export type RejectAusgabeUseCase = {
  execute: (params: RejectAusgabeParams) => Promise<RejectAusgabeResult>;
};

/**
 * Factory für RejectAusgabeUseCase
 */
export const createRejectAusgabeUseCase = (
  ausgabenRepository: IAusgabenRepository,
  benachrichtigungRepository: IBenachrichtigungRepository,
  auditLogService: AuditLogService
): RejectAusgabeUseCase => ({
  execute: async ({ ausgabeId, data, userId, userRole, userName, context }) => {
    try {
      // 1. Rollenprüfung - NUR Vorstand
      if (userRole !== "VORSTAND" && userRole !== "ADMIN") {
        return {
          success: false,
          error: createPermissionError("ablehnen", "Ausgaben"),
        };
      }

      // 2. Validierung
      if (!data.rejectionReason || data.rejectionReason.length < 10) {
        return {
          success: false,
          error: createValidationError(
            "rejectionReason",
            "Ablehnungsgrund muss mindestens 10 Zeichen lang sein"
          ),
        };
      }

      // 3. Ausgabe laden
      const ausgabe = await ausgabenRepository.findById(ausgabeId, userId);
      if (!ausgabe) {
        return {
          success: false,
          error: createNotFoundError("Ausgabe", ausgabeId),
        };
      }

      // 4. Status prüfen
      if (ausgabe.status !== "eingereicht") {
        return {
          success: false,
          error: createBusinessError(
            `Ausgabe kann nicht abgelehnt werden (Status: ${ausgabe.status})`
          ),
        };
      }

      // 5. Ausgabe ablehnen
      await ausgabenRepository.update(
        ausgabeId,
        {
          status: "abgelehnt",
          genehmigtVon: userId,
          genehmigtAm: new Date(),
          ablehnungsgrund: data.rejectionReason,
        },
        userId
      );

      // 6. Audit Log mit detaillierten Gründen
      await auditLogService.logAction({
        userId,
        userName,
        action: "rejected",
        entityType: "finance",
        entityId: ausgabeId,
        entityName: `Ausgabe: ${ausgabe.beschreibung}`,
        metadata: {
          rejectionReason: data.rejectionReason,
          suggestions: data.suggestions,
          originalData: {
            betrag: ausgabe.betrag,
            kategorie: ausgabe.kategorie,
            eingereichtVon: ausgabe.eingereichtVon,
          },
        },
        context,
      });

      // 7. Benachrichtigung an Einreicher mit Verbesserungsvorschlägen
      const nachrichtText = data.suggestions
        ? `Ihre Ausgabe "${ausgabe.beschreibung}" wurde abgelehnt.\n\nGrund: ${data.rejectionReason}\n\nVorschläge: ${data.suggestions}`
        : `Ihre Ausgabe "${ausgabe.beschreibung}" wurde abgelehnt.\n\nGrund: ${data.rejectionReason}`;

      const benachrichtigung = createBenachrichtigung({
        empfaengerId: ausgabe.eingereichtVon,
        typ: "genehmigung_abgelehnt",
        titel: "Ausgabe abgelehnt",
        nachricht: nachrichtText,
        kontextTyp: "ausgabe",
        kontextId: ausgabeId,
        prioritaet: "hoch",
      });

      await benachrichtigungRepository.create(benachrichtigung);

      return {
        success: true,
      };

    } catch (error) {
      console.error("RejectAusgabeUseCase error:", error);

      await auditLogService.logAction({
        userId,
        userName,
        action: "rejected",
        entityType: "finance",
        entityId: ausgabeId,
        metadata: {
          error: (error as Error).message,
          errorType: "exception",
          attemptedReason: data.rejectionReason,
        },
        context,
      });

      return {
        success: false,
        error: createBusinessError("Fehler beim Ablehnen der Ausgabe"),
      };
    }
  },
});

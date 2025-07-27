// apps/api/src/application/use-cases/finance/CreateAusgabeUseCase.ts

import type { IAusgabenRepository } from "@/domain/repositories/IAusgabenRepository";
import type { IEventRepository } from "@/domain/repositories/IEventRepository";
import type { IBenachrichtigungRepository } from "@/domain/repositories/IBenachrichtigungRepository";
import type { AuditLogService } from "@/application/services/AuditLogService";
import type { CreateAusgabeDTO } from "@/application/dto/finance";
import { createAusgabe } from "@/domain/entities/Ausgabe";
import { createBenachrichtigung } from "@/domain/entities/Benachrichtigung";
import {
  createValidationError,
  createBusinessError,
  ERROR_CODES,
} from "@/application/dto/common";

/**
 * Create Ausgabe Parameters
 * @description Parameter für Ausgaben-Erstellung
 */
export type CreateAusgabeParams = {
  readonly data: CreateAusgabeDTO;
  readonly userId: string;
  readonly userName?: string;
  readonly context?: {
    readonly ipAddress?: string;
    readonly userAgent?: string;
    readonly sessionId?: string;
  };
};

/**
 * Create Ausgabe Result
 * @description Ergebnis der Ausgaben-Erstellung
 */
export type CreateAusgabeResult = {
  readonly success: boolean;
  readonly ausgabeId?: string;
  readonly error?: any;
  readonly warnings?: string[];
};

/**
 * Create Ausgabe Use Case
 * @description Erstellt eine neue Ausgabe mit Budget-Prüfung und Validierung
 */
export type CreateAusgabeUseCase = {
  execute: (params: CreateAusgabeParams) => Promise<CreateAusgabeResult>;
};

/**
 * Factory für CreateAusgabeUseCase
 */
export const createCreateAusgabeUseCase = (
  ausgabenRepository: IAusgabenRepository,
  eventRepository: IEventRepository,
  benachrichtigungRepository: IBenachrichtigungRepository,
  auditLogService: AuditLogService,
  fileUploadService?: any // TODO: Proper FileUploadService type
): CreateAusgabeUseCase => ({
  execute: async ({ data, userId, userName, context }) => {
    try {
      // 1. Event laden und prüfen
      const event = await eventRepository.findById(data.eventId);
      if (!event) {
        return {
          success: false,
          error: createBusinessError("Event nicht gefunden"),
        };
      }

      // 2. Prüfe Event-Status
      if (event.status === "abgesagt" || event.status === "abgeschlossen") {
        return {
          success: false,
          error: createBusinessError(
            `Ausgaben können nicht für ${event.status}e Events eingereicht werden`
          ),
        };
      }

      // 3. Budget-Prüfung
      const warnings: string[] = [];
      const currentTotal = await ausgabenRepository.getTotalByEvent(event.id);
      const projectedTotal = currentTotal + data.betrag;

      if (event.budget && projectedTotal > event.budget) {
        const percentage = Math.round((projectedTotal / event.budget) * 100);
        warnings.push(
          `Budget-Warnung: Mit dieser Ausgabe werden ${percentage}% des Budgets (${event.budget}€) erreicht`
        );

        // Kritisch wenn über 120%
        if (percentage > 120) {
          return {
            success: false,
            error: createBusinessError(
              "Budget-Überschreitung: Ausgabe würde das Budget um mehr als 20% überschreiten",
              ERROR_CODES.BUSINESS_RULE_VIOLATION,
              { currentTotal, newAmount: data.betrag, budget: event.budget }
            ),
          };
        }
      }

      // 4. Validierung
      if (data.betrag <= 0) {
        return {
          success: false,
          error: createValidationError("betrag", "Betrag muss größer als 0 sein"),
        };
      }

      if (data.beschreibung.length < 10) {
        return {
          success: false,
          error: createValidationError(
            "beschreibung",
            "Beschreibung muss mindestens 10 Zeichen lang sein"
          ),
        };
      }

      // 5. Beleg-Pflicht prüfen
      if (data.betrag >= 50 && !data.belegFile) {
        warnings.push("Hinweis: Für Ausgaben über 50€ wird normalerweise ein Beleg empfohlen");
      }

      // 6. Beleg hochladen (falls vorhanden)
      let belegUrl: string | undefined;
      if (data.belegFile && fileUploadService) {
        const uploadResult = await fileUploadService.uploadFile({
          fileName: `beleg_${event.id}_${Date.now()}_${data.belegFile.fileName}`,
          mimeType: data.belegFile.mimeType,
          fileContent: Buffer.from(data.belegFile.base64Data, 'base64'),
          folderId: 'ausgaben',
          isPublic: false,
        });
        belegUrl = uploadResult.fileUrl;
      }

      // 7. Ausgabe erstellen
      const ausgabe = createAusgabe({
        eventId: event.id,
        beschreibung: data.beschreibung,
        betrag: data.betrag,
        kategorie: data.kategorie,
        belegUrl,
        rechnungsnummer: data.rechnungsnummer,
        eingereichtVon: userId,
      });

      const savedAusgabe = await ausgabenRepository.create(ausgabe, userId);

      // 8. Audit Log
      await auditLogService.logCreation({
        userId,
        userName,
        entityType: "finance",
        entityId: savedAusgabe.id,
        entityName: `Ausgabe: ${data.beschreibung}`,
        metadata: {
          eventId: event.id,
          eventTitle: event.title,
          betrag: data.betrag,
          kategorie: data.kategorie,
          hatBeleg: !!belegUrl,
          budgetStatus: event.budget ? {
            used: projectedTotal,
            total: event.budget,
            percentage: Math.round((projectedTotal / event.budget) * 100)
          } : null,
        },
        context,
      });

      // 9. Benachrichtigung an Event-Verantwortlichen
      if (event.responsibleMemberId && event.responsibleMemberId !== userId) {
        const benachrichtigung = createBenachrichtigung({
          empfaengerId: event.responsibleMemberId,
          typ: "system",
          titel: "Neue Ausgabe eingereicht",
          nachricht: `${userName || "Ein Mitglied"} hat eine Ausgabe von ${data.betrag}€ für "${event.title}" eingereicht.`,
          kontextTyp: "ausgabe",
          kontextId: savedAusgabe.id,
          prioritaet: data.betrag > 100 ? "hoch" : "medium",
        });

        await benachrichtigungRepository.create(benachrichtigung);
      }

      return {
        success: true,
        ausgabeId: savedAusgabe.id,
        warnings: warnings.length > 0 ? warnings : undefined,
      };

    } catch (error) {
      console.error("CreateAusgabeUseCase error:", error);

      // Log failed attempt
      await auditLogService.logAction({
        userId,
        userName,
        action: "rejected",
        entityType: "finance",
        entityId: "new",
        metadata: {
          error: (error as Error).message,
          attemptedData: {
            eventId: data.eventId,
            betrag: data.betrag,
            kategorie: data.kategorie,
          },
        },
        context,
      });

      return {
        success: false,
        error: createBusinessError(
          "Fehler beim Erstellen der Ausgabe",
          ERROR_CODES.SYSTEM_INTERNAL_ERROR
        ),
      };
    }
  },
});

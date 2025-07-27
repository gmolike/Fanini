// apps/api/src/application/use-cases/finance/ExportFinancialDataUseCase.ts

import type { IAusgabenRepository } from "@/domain/repositories/IAusgabenRepository";
import type { IEventRepository } from "@/domain/repositories/IEventRepository";
import type { AuditLogService } from "@/application/services/AuditLogService";
import type { FinancialExportDTO } from "@/application/dto/finance";
import { createBusinessError, createPermissionError, createValidationError } from "@/application/dto/common";

/**
 * Export Financial Data Parameters
 * @description Parameter für Finanzdaten-Export
 */
export type ExportFinancialDataParams = {
  readonly filters: {
    readonly fromDate: string;
    readonly toDate: string;
    readonly eventIds?: string[];
    readonly format: "json" | "csv" | "excel";
  };
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
 * Export Financial Data Result
 * @description Ergebnis des Finanzdaten-Exports
 */
export type ExportFinancialDataResult = {
  readonly success: boolean;
  readonly exportData?: FinancialExportDTO;
  readonly downloadUrl?: string;
  readonly error?: any;
};

/**
 * Export Financial Data Use Case
 * @description Exportiert Finanzdaten für Kassenprüfer
 */
export type ExportFinancialDataUseCase = {
  execute: (params: ExportFinancialDataParams) => Promise<ExportFinancialDataResult>;
};

/**
 * Factory für ExportFinancialDataUseCase
 */
export const createExportFinancialDataUseCase = (
  ausgabenRepository: IAusgabenRepository,
  eventRepository: IEventRepository,
  auditLogService: AuditLogService,
  exportService?: any // TODO: ExportService type
): ExportFinancialDataUseCase => ({
  execute: async ({ filters, userId, userRole, userName, context }) => {
    try {
      // 1. Berechtigungsprüfung - Nur Kassenprüfer, Vorstand, Admin
      const allowedRoles = ["KASSENPRUFER", "VORSTAND", "ADMIN"];
      if (!allowedRoles.includes(userRole)) {
        await auditLogService.logAction({
          userId,
          userName,
          action: "rejected",
          entityType: "finance",
          entityId: "export",
          metadata: {
            reason: "insufficient_permissions",
            requiredRoles: allowedRoles,
            userRole,
          },
          context,
        });

        return {
          success: false,
          error: createPermissionError("Finanzdaten exportieren"),
        };
      }

      // 2. Datums-Validierung
      const fromDate = new Date(filters.fromDate);
      const toDate = new Date(filters.toDate);

      if (fromDate > toDate) {
        return {
          success: false,
          error: createValidationError("fromDate", "Von-Datum darf nicht nach Bis-Datum liegen"),
        };
      }

      // Max 1 Jahr
      const daysDiff = (toDate.getTime() - fromDate.getTime()) / (1000 * 60 * 60 * 24);
      if (daysDiff > 366) {
        return {
          success: false,
          error: createValidationError("period", "Maximaler Exportzeitraum ist 1 Jahr"),
        };
      }

      // 3. Events im Zeitraum laden
      const events = await eventRepository.findAll({
        fromDate,
        toDate,
        includeDeleted: false,
      });

      // Filter auf spezifische Events
      const relevantEvents = filters.eventIds
        ? events.filter(e => filters.eventIds!.includes(e.id))
        : events;

      // 4. Ausgaben für alle Events laden
      const eventData = await Promise.all(
        relevantEvents.map(async (event) => {
          const ausgaben = await ausgabenRepository.findAll(userId, {
            eventId: event.id,
            status: "genehmigt", // Nur genehmigte für Kassenprüfung
          });

          const summary = ausgaben.reduce((acc, ausgabe) => {
            acc.total += ausgabe.betrag;
            acc.byCategory[ausgabe.kategorie] =
              (acc.byCategory[ausgabe.kategorie] || 0) + ausgabe.betrag;
            return acc;
          }, {
            total: 0,
            byCategory: {} as Record<string, number>,
          });

          return {
            id: event.id,
            title: event.title,
            date: event.date.toISOString(),
            budget: event.budget || 0,
            ausgaben: ausgaben.map(a => ({
              // Map zu InternalAusgabeDetailDTO
              id: a.id,
              event: {
                id: event.id,
                title: event.title,
                date: event.date.toISOString(),
                budget: event.budget,
                budgetUsed: event.budgetUsed,
              },
              betrag: a.betrag,
              kategorie: a.kategorie,
              status: a.status,
              eingereichtAm: a.eingereichtAm.toISOString(),
              beschreibung: a.beschreibung,
              belegUrl: a.belegUrl,
              rechnungsnummer: a.rechnungsnummer,
              eingereichtVon: {
                id: a.eingereichtVon,
                name: a.metadata?.einreicherName || "Unbekannt",
              },
              genehmigtVon: a.genehmigtVon ? {
                id: a.genehmigtVon,
                name: "Vorstand", // TODO: Load actual name
              } : undefined,
              genehmigtAm: a.genehmigtAm?.toISOString(),
              metadata: {
                createdAt: a.eingereichtAm.toISOString(),
                updatedAt: a.eingereichtAm.toISOString(),
                version: 1,
                hasBeenEdited: false,
                editCount: 0,
              },
              permissions: {
                canEdit: false,
                canDelete: false,
                canApprove: false,
                canReject: false,
                canViewReceipt: true,
              },
            })),
            summary,
          };
        })
      );

      // 5. Totals berechnen
      const totals = eventData.reduce((acc, event) => {
        acc.events++;
        acc.ausgaben += event.ausgaben.length;
        acc.totalAmount += event.summary.total;
        return acc;
      }, {
        events: 0,
        ausgaben: 0,
        totalAmount: 0,
        averagePerEvent: 0,
      });

      totals.averagePerEvent = totals.events > 0
        ? Math.round(totals.totalAmount / totals.events)
        : 0;

      // 6. Export DTO erstellen
      const exportData: FinancialExportDTO = {
        exportDate: new Date().toISOString(),
        exportedBy: userId,
        period: {
          from: filters.fromDate,
          to: filters.toDate,
        },
        events: eventData,
        totals,
        format: filters.format,
      };

      // 7. Audit Log für Export
      await auditLogService.logAction({
        userId,
        userName,
        action: "exported",
        entityType: "finance",
        entityId: "bulk",
        metadata: {
          exportType: "kassenpruefung",
          period: {
            from: filters.fromDate,
            to: filters.toDate,
          },
          eventCount: totals.events,
          ausgabenCount: totals.ausgaben,
          totalAmount: totals.totalAmount,
          format: filters.format,
        },
        context,
      });

      // 8. Export-Datei generieren (falls Service vorhanden)
      let downloadUrl: string | undefined;
      if (exportService) {
        const file = await exportService.generateExport(exportData, filters.format);
        downloadUrl = file.url;
      }

      return {
        success: true,
        exportData,
        downloadUrl,
      };

    } catch (error) {
      console.error("ExportFinancialDataUseCase error:", error);

      await auditLogService.logAction({
        userId,
        userName,
        action: "rejected",
        entityType: "finance",
        entityId: "export",
        metadata: {
          error: (error as Error).message,
          errorType: "exception",
          filters,
        },
        context,
      });

      return {
        success: false,
        error: createBusinessError("Fehler beim Exportieren der Finanzdaten"),
      };
    }
  },
});

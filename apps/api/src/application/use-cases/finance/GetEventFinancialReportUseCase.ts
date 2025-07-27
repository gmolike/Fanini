// apps/api/src/application/use-cases/finance/GetEventFinancialReportUseCase.ts

import type { IAusgabenRepository } from "@/domain/repositories/IAusgabenRepository";
import type { IEventRepository } from "@/domain/repositories/IEventRepository";
import type {
  FinancialReportDTO,
  BudgetOverviewDTO,
} from "@/application/dto/finance";
import {
  createBusinessError,
  createNotFoundError,
  createPermissionError,
} from "@/application/dto/common";

/**
 * Get Event Financial Report Parameters
 * @description Parameter für Event-Finanzbericht
 */
export type GetEventFinancialReportParams = {
  readonly eventId: string;
  readonly userId: string;
  readonly userRole: string;
};

/**
 * Get Event Financial Report Result
 * @description Ergebnis des Event-Finanzberichts
 */
export type GetEventFinancialReportResult = {
  readonly report?: FinancialReportDTO;
  readonly budget?: BudgetOverviewDTO;
  readonly error?: any;
};

/**
 * Get Event Financial Report Use Case
 * @description Erstellt einen detaillierten Finanzbericht für ein Event
 */
export type GetEventFinancialReportUseCase = {
  execute: (
    params: GetEventFinancialReportParams,
  ) => Promise<GetEventFinancialReportResult>;
};

/**
 * Factory für GetEventFinancialReportUseCase
 */
export const createGetEventFinancialReportUseCase = (
  ausgabenRepository: IAusgabenRepository,
  eventRepository: IEventRepository,
  cacheService?: any, // TODO: CacheService type
): GetEventFinancialReportUseCase => ({
  execute: async ({ eventId, userId, userRole }) => {
    try {
      // 1. Event laden
      const event = await eventRepository.findById(eventId);
      if (!event) {
        return {
          error: createNotFoundError("Event", eventId),
        };
      }

      // 2. Berechtigungsprüfung
      const canViewFinancials =
        userRole === "ADMIN" ||
        userRole === "VORSTAND" ||
        userRole === "KASSENPRUFER" ||
        (userRole === "BEIRAT" && event.responsibleMemberId === userId);

      if (!canViewFinancials) {
        return {
          error: createPermissionError("Finanzbericht anzeigen", "Event"),
        };
      }

      // 3. Cache prüfen
      const cacheKey = `financial_report_${eventId}`;
      if (cacheService) {
        const cached = await cacheService.get(cacheKey);
        if (cached) {
          return { report: cached.report, budget: cached.budget };
        }
      }

      // 4. Ausgaben laden
      const ausgaben = await ausgabenRepository.findAll(userId, { eventId });

      // 5. Aggregationen berechnen
      const summary = {
        totalAusgaben: 0,
        totalGenehmigt: 0,
        totalPending: 0,
        totalAbgelehnt: 0,
        ausgabenCount: ausgaben.length,
      };

      const byCategory: Record<string, { betrag: number; count: number }> = {};
      const byStatus: Record<string, { betrag: number; count: number }> = {};

      for (const ausgabe of ausgaben) {
        // Summary
        summary.totalAusgaben += ausgabe.betrag;
        if (ausgabe.status === "genehmigt") {
          summary.totalGenehmigt += ausgabe.betrag;
        } else if (ausgabe.status === "eingereicht") {
          summary.totalPending += ausgabe.betrag;
        } else if (ausgabe.status === "abgelehnt") {
          summary.totalAbgelehnt += ausgabe.betrag;
        }

        // By Category
        if (!byCategory[ausgabe.kategorie]) {
          byCategory[ausgabe.kategorie] = { betrag: 0, count: 0 };
        }
        byCategory[ausgabe.kategorie].betrag += ausgabe.betrag;
        byCategory[ausgabe.kategorie].count++;

        // By Status
        if (!byStatus[ausgabe.status]) {
          byStatus[ausgabe.status] = { betrag: 0, count: 0 };
        }
        byStatus[ausgabe.status].betrag += ausgabe.betrag;
        byStatus[ausgabe.status].count++;
      }

      // 6. Report erstellen
      const report: FinancialReportDTO = {
        reportType: "event",
        period: {
          from: event.date.toISOString(),
          to: event.date.toISOString(),
        },
        summary,
        byCategory: Object.entries(byCategory).map(([kategorie, data]) => ({
          kategorie: kategorie as any,
          betrag: data.betrag,
          count: data.count,
          percentage: Math.round((data.betrag / summary.totalAusgaben) * 100),
        })),
        byStatus: Object.entries(byStatus).map(([status, data]) => ({
          status: status as any,
          betrag: data.betrag,
          count: data.count,
        })),
        topAusgaben: ausgaben
          .sort((a, b) => b.betrag - a.betrag)
          .slice(0, 5)
          .map((a) => ({
            id: a.id,
            eventId: a.eventId,
            eventTitle: event.title,
            betrag: a.betrag,
            kategorie: a.kategorie,
            status: a.status,
            eingereichtAm: a.eingereichtAm.toISOString(),
          })),
        metadata: {
          generatedAt: new Date().toISOString(),
          generatedBy: userId,
          dataComplete: true,
        },
      };

      // 7. Budget Overview
      const budget: BudgetOverviewDTO | undefined = event.budget
        ? {
            eventId: event.id,
            eventTitle: event.title,
            budget: event.budget,
            budgetUsed: summary.totalGenehmigt,
            budgetRemaining: event.budget - summary.totalGenehmigt,
            budgetPercentage: Math.round(
              (summary.totalGenehmigt / event.budget) * 100,
            ),
            status:
              summary.totalGenehmigt > event.budget
                ? "over"
                : summary.totalGenehmigt > event.budget * 0.9
                  ? "warning"
                  : summary.totalGenehmigt > event.budget * 0.7
                    ? "on_track"
                    : "under",
            ausgaben: Object.entries(byCategory).map(([kategorie, data]) => ({
              kategorie: kategorie as any,
              planned: 0, // TODO: Budget planning integration
              actual: data.betrag,
              variance: data.betrag,
            })),
            projectedTotal: summary.totalGenehmigt + summary.totalPending,
            recommendations: generateRecommendations(
              event.budget,
              summary.totalGenehmigt,
              summary.totalPending,
            ),
          }
        : undefined;

      // 8. Cache speichern
      if (cacheService) {
        await cacheService.set(cacheKey, { report, budget }, 300); // 5 Minuten
      }

      return { report, budget };
    } catch (error) {
      console.error("GetEventFinancialReportUseCase error:", error);
      return {
        error: createBusinessError("Fehler beim Erstellen des Finanzberichts"),
      };
    }
  },
});

/**
 * Generiert Budget-Empfehlungen
 */
const generateRecommendations = (
  budget: number,
  used: number,
  pending: number,
): string[] => {
  const recommendations: string[] = [];
  const percentage = (used / budget) * 100;
  const projectedPercentage = ((used + pending) / budget) * 100;

  if (percentage > 90) {
    recommendations.push(
      "Budget fast aufgebraucht - nur noch kritische Ausgaben genehmigen",
    );
  }

  if (projectedPercentage > 100) {
    recommendations.push(
      "Ausstehende Ausgaben würden Budget überschreiten - Priorisierung erforderlich",
    );
  }

  if (percentage < 50 && projectedPercentage < 60) {
    recommendations.push("Budget-Nutzung im grünen Bereich");
  }

  return recommendations;
};

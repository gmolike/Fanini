// apps/api/src/application/dto/finance/AusgabenStatsDTO.ts

import { AusgabeKategorie, AusgabeStatus } from "@/domain/entities";

/**
 * Ausgaben Yearly Stats
 * @description Jahresstatistik für Ausgaben
 */
export type AusgabenYearlyStats = {
  readonly year: number;
  readonly months: Array<{
    readonly month: number;
    readonly monthName: string;
    readonly total: number;
    readonly count: number;
    readonly byCategory: Record<AusgabeKategorie, number>;
    readonly byStatus: Record<AusgabeStatus, number>;
  }>;
  readonly totals: {
    readonly amount: number;
    readonly count: number;
    readonly approved: number;
    readonly pending: number;
    readonly rejected: number;
  };
  readonly byCategory: Array<{
    readonly kategorie: AusgabeKategorie;
    readonly amount: number;
    readonly count: number;
    readonly percentage: number;
  }>;
  readonly topEvents: Array<{
    readonly eventId: string;
    readonly eventTitle: string;
    readonly totalAmount: number;
    readonly ausgabenCount: number;
  }>;
  readonly trends: {
    readonly monthlyAverage: number;
    readonly growthRate: number;
    readonly peakMonth: number;
    readonly lowestMonth: number;
  };
};

// apps/api/src/application/dto/finance/FinancialReportDTO.ts

import { AusgabeKategorie, AusgabeStatus } from "@/domain/entities";
import { InternalAusgabeDetailDTO } from "./AusgabeDetailDTO";
import { PublicAusgabeListDTO } from "./AusgabeListDTO";

/**
 * Financial Report DTO
 * @description Finanzübersicht für Events oder Zeiträume
 */
export type FinancialReportDTO = {
  readonly reportType: 'event' | 'monthly' | 'yearly' | 'custom';
  readonly period: {
    readonly from: string;
    readonly to: string;
  };
  readonly summary: {
    readonly totalAusgaben: number;
    readonly totalGenehmigt: number;
    readonly totalPending: number;
    readonly totalAbgelehnt: number;
    readonly ausgabenCount: number;
  };
  readonly byCategory: Array<{
    readonly kategorie: AusgabeKategorie;
    readonly betrag: number;
    readonly count: number;
    readonly percentage: number;
  }>;
  readonly byStatus: Array<{
    readonly status: AusgabeStatus;
    readonly betrag: number;
    readonly count: number;
  }>;
  readonly topAusgaben: PublicAusgabeListDTO[];
  readonly metadata: {
    readonly generatedAt: string;
    readonly generatedBy: string;
    readonly dataComplete: boolean;
  };
};

/**
 * Budget Overview DTO
 * @description Budget-Status für Events
 */
export type BudgetOverviewDTO = {
  readonly eventId: string;
  readonly eventTitle: string;
  readonly budget: number;
  readonly budgetUsed: number;
  readonly budgetRemaining: number;
  readonly budgetPercentage: number;
  readonly status: 'under' | 'on_track' | 'warning' | 'over';
  readonly ausgaben: Array<{
    readonly kategorie: AusgabeKategorie;
    readonly planned: number;
    readonly actual: number;
    readonly variance: number;
  }>;
  readonly projectedTotal: number;
  readonly recommendations?: string[];
};

/**
 * Financial Export DTO
 * @description Export-Format für Kassenprüfer
 */
export type FinancialExportDTO = {
  readonly exportDate: string;
  readonly exportedBy: string;
  readonly period: {
    readonly from: string;
    readonly to: string;
  };
  readonly events: Array<{
    readonly id: string;
    readonly title: string;
    readonly date: string;
    readonly budget: number;
    readonly ausgaben: InternalAusgabeDetailDTO[];
    readonly summary: {
      readonly total: number;
      readonly byCategory: Record<AusgabeKategorie, number>;
    };
  }>;
  readonly totals: {
    readonly events: number;
    readonly ausgaben: number;
    readonly totalAmount: number;
    readonly averagePerEvent: number;
  };
  readonly format: 'json' | 'csv' | 'excel';
};

// apps/api/src/application/dto/audit/AuditLogEntryDTO.ts
import type { AuditAction, AuditEntityType } from "@/domain/entities/AuditLog";

/**
 * Audit Log Entry DTO
 * @description Einzelner Audit Log Eintrag für API Responses
 */
export type AuditLogEntryDTO = {
  readonly id: string;
  readonly timestamp: string;
  readonly user: {
    readonly id: string;
    readonly name: string;
  };
  readonly action: AuditAction;
  readonly entity: {
    readonly type: AuditEntityType;
    readonly id: string;
    readonly name?: string;
  };
  readonly changes?: Array<{
    readonly field: string;
    readonly oldValue: string;
    readonly newValue: string;
  }>;
  readonly metadata?: Record<string, any>;
};

/**
 * Audit Log Filter DTO
 * @description Filter für Audit Log Abfragen
 */
export type AuditLogFilterDTO = {
  readonly userId?: string;
  readonly entityType?: AuditEntityType;
  readonly entityId?: string;
  readonly action?: AuditAction | AuditAction[];
  readonly fromDate?: string;
  readonly toDate?: string;
  readonly page?: number;
  readonly pageSize?: number;
};

/**
 * Audit Log Export DTO
 * @description Exportformat für DSGVO Anfragen
 */
export type AuditLogExportDTO = {
  readonly exportDate: string;
  readonly requestedBy: string;
  readonly filters: AuditLogFilterDTO;
  readonly entries: AuditLogEntryDTO[];
  readonly totalCount: number;
  readonly anonymized: boolean;
};

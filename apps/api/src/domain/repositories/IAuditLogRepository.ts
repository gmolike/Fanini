// apps/api/src/domain/repositories/IAuditLogRepository.ts
import type { AuditLog, AuditAction, AuditEntityType } from "../entities/AuditLog";

export type AuditLogFilters = {
  readonly userId?: string;
  readonly entityType?: AuditEntityType;
  readonly entityId?: string;
  readonly action?: AuditAction | AuditAction[];
  readonly fromDate?: Date;
  readonly toDate?: Date;
  readonly limit?: number;
  readonly offset?: number;
};

export type AuditLogStats = {
  readonly totalEntries: number;
  readonly actionCounts: Record<AuditAction, number>;
  readonly userCounts: Record<string, number>;
  readonly entityTypeCounts: Record<AuditEntityType, number>;
};

/**
 * Audit Log Repository Interface
 * @description Definiert Methoden für Audit Log Datenzugriff
 */
export type IAuditLogRepository = {
  /**
   * Erstellt einen neuen Audit Log Eintrag
   */
  create(log: Omit<AuditLog, "id" | "timestamp">): Promise<AuditLog>;

  /**
   * Findet Audit Logs mit Filtern
   */
  findAll(filters: AuditLogFilters): Promise<AuditLog[]>;

  /**
   * Findet Audit Logs für eine spezifische Entität
   */
  findByEntity(entityType: AuditEntityType, entityId: string): Promise<AuditLog[]>;

  /**
   * Findet Audit Logs für einen spezifischen User
   */
  findByUser(userId: string, filters?: AuditLogFilters): Promise<AuditLog[]>;

  /**
   * Zählt Audit Log Einträge
   */
  count(filters: AuditLogFilters): Promise<number>;

  /**
   * Holt Statistiken
   */
  getStats(filters: AuditLogFilters): Promise<AuditLogStats>;

  /**
   * Löscht alte Audit Logs (DSGVO Compliance)
   */
  deleteOlderThan(date: Date): Promise<number>;
};

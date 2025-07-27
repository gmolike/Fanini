// apps/api/src/application/use-cases/audit/ExportAuditLogUseCase.ts
import type { IAuditLogRepository } from "@/domain/repositories/IAuditLogRepository";
import type { AuditLogExportDTO, AuditLogFilterDTO } from "@/application/dto/audit";
import { anonymizeAuditLog } from "@/domain/entities/AuditLog";

export type ExportAuditLogParams = {
  filters: AuditLogFilterDTO;
  anonymize?: boolean;
  userId: string;
  userRole: string;
};

export type ExportAuditLogResult = AuditLogExportDTO;

export type ExportAuditLogUseCase = {
  execute: (params: ExportAuditLogParams) => Promise<ExportAuditLogResult>;
};

export const createExportAuditLogUseCase = (
  auditLogRepository: IAuditLogRepository,
  auditLogService: any // AuditLogService Type hier einfügen
): ExportAuditLogUseCase => ({
  execute: async ({ filters, anonymize = false, userId, userRole }) => {
    // DSGVO: Jeder kann seine eigenen Daten exportieren
    const isOwnData = filters.userId === userId;
    const canExportOthers = ["ADMIN", "VORSTAND"].includes(userRole);

    if (!isOwnData && !canExportOthers) {
      throw new Error("Keine Berechtigung für Export fremder Daten");
    }

    const repositoryFilters = {
      userId: filters.userId,
      entityType: filters.entityType,
      entityId: filters.entityId,
      action: filters.action,
      fromDate: filters.fromDate ? new Date(filters.fromDate) : undefined,
      toDate: filters.toDate ? new Date(filters.toDate) : undefined
    };

    const logs = await auditLogRepository.findAll(repositoryFilters);

    // Anonymisierung wenn gewünscht oder für DSGVO Export
    const processedLogs = anonymize || isOwnData
      ? logs.map(anonymizeAuditLog)
      : logs;

    const entries = processedLogs.map(log => ({
      id: log.id,
      timestamp: log.timestamp.toISOString(),
      user: {
        id: log.userId,
        name: log.userName || "Unbekannt"
      },
      action: log.action,
      entity: {
        type: log.entityType,
        id: log.entityId,
        name: log.entityName
      },
      changes: log.changes?.map(change => ({
        field: change.field,
        oldValue: String(change.oldValue),
        newValue: String(change.newValue)
      })),
      metadata: log.metadata
    }));

    // Log den Export selbst
    await auditLogService.logAction({
      userId,
      action: "exported",
      entityType: "audit_log",
      entityId: "bulk",
      metadata: {
        exportedCount: entries.length,
        filters,
        anonymized: anonymize || isOwnData
      }
    });

    return {
      exportDate: new Date().toISOString(),
      requestedBy: userId,
      filters,
      entries,
      totalCount: entries.length,
      anonymized: anonymize || isOwnData
    };
  }
});

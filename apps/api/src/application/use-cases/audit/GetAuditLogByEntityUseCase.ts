// apps/api/src/application/use-cases/audit/GetAuditLogByEntityUseCase.ts
import type { IAuditLogRepository } from "@/domain/repositories/IAuditLogRepository";
import type { AuditLogEntryDTO } from "@/application/dto/audit";
import type { AuditEntityType } from "@/domain/entities/AuditLog";

export type GetAuditLogByEntityParams = {
  entityType: AuditEntityType;
  entityId: string;
  userId: string;
  userRole: string;
};

export type GetAuditLogByEntityResult = {
  entries: AuditLogEntryDTO[];
  totalCount: number;
};

export type GetAuditLogByEntityUseCase = {
  execute: (params: GetAuditLogByEntityParams) => Promise<GetAuditLogByEntityResult>;
};

export const createGetAuditLogByEntityUseCase = (
  auditLogRepository: IAuditLogRepository
): GetAuditLogByEntityUseCase => ({
  execute: async ({ entityType, entityId, userId, userRole }) => {
    // Berechtigungsprüfung
    if (!canViewAuditLog(userRole)) {
      throw new Error("Keine Berechtigung für Audit Log Zugriff");
    }

    const logs = await auditLogRepository.findByEntity(entityType, entityId);

    const entries: AuditLogEntryDTO[] = logs.map(log => ({
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

    return {
      entries,
      totalCount: entries.length
    };
  }
});

const canViewAuditLog = (userRole: string): boolean => {
  const allowedRoles = ["ADMIN", "VORSTAND", "BEIRAT"];
  return allowedRoles.includes(userRole);
};

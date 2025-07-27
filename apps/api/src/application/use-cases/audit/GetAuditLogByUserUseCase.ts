// apps/api/src/application/use-cases/audit/GetAuditLogByUserUseCase.ts
import type { IAuditLogRepository } from "@/domain/repositories/IAuditLogRepository";
import type { AuditLogEntryDTO, AuditLogFilterDTO } from "@/application/dto/audit";
import type { PaginationDTO } from "@/application/dto/common";
import { createPaginationDTO, normalizePaginationParams } from "@/application/dto/common";

export type GetAuditLogByUserParams = {
  targetUserId: string;
  filters?: AuditLogFilterDTO;
  userId: string;
  userRole: string;
};

export type GetAuditLogByUserResult = {
  entries: AuditLogEntryDTO[];
  pagination: PaginationDTO;
};

export type GetAuditLogByUserUseCase = {
  execute: (params: GetAuditLogByUserParams) => Promise<GetAuditLogByUserResult>;
};

export const createGetAuditLogByUserUseCase = (
  auditLogRepository: IAuditLogRepository
): GetAuditLogByUserUseCase => ({
  execute: async ({ targetUserId, filters = {}, userId, userRole }) => {
    // Berechtigungsprüfung
    const canViewOthers = ["ADMIN", "VORSTAND"].includes(userRole);
    if (targetUserId !== userId && !canViewOthers) {
      throw new Error("Keine Berechtigung für fremde Audit Logs");
    }

    const pagination = normalizePaginationParams({
      page: filters.page,
      pageSize: filters.pageSize
    });

    const repositoryFilters = {
      userId: targetUserId,
      entityType: filters.entityType,
      action: filters.action,
      fromDate: filters.fromDate ? new Date(filters.fromDate) : undefined,
      toDate: filters.toDate ? new Date(filters.toDate) : undefined,
      limit: pagination.pageSize,
      offset: (pagination.page - 1) * pagination.pageSize
    };

    const [logs, totalCount] = await Promise.all([
      auditLogRepository.findByUser(targetUserId, repositoryFilters),
      auditLogRepository.count({ userId: targetUserId })
    ]);

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
      pagination: createPaginationDTO({
        page: pagination.page,
        pageSize: pagination.pageSize,
        totalItems: totalCount
      })
    };
  }
});

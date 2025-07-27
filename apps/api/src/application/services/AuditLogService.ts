// apps/api/src/application/services/AuditLogService.ts
import type { IAuditLogRepository } from "@/domain/repositories/IAuditLogRepository";
import type { AuditLog, AuditAction, AuditEntityType, FieldChange } from "@/domain/entities/AuditLog";
import { createAuditLog } from "@/domain/entities/AuditLog";

/**
 * Audit Log Service
 * @description Zentrale Service für Audit Logging
 */
export type AuditLogService = {
  /**
   * Loggt eine Aktion
   */
  logAction: (params: LogActionParams) => Promise<void>;

  /**
   * Loggt eine Entitäts-Erstellung
   */
  logCreation: (params: LogCreationParams) => Promise<void>;

  /**
   * Loggt eine Entitäts-Aktualisierung
   */
  logUpdate: (params: LogUpdateParams) => Promise<void>;

  /**
   * Loggt eine Entitäts-Löschung
   */
  logDeletion: (params: LogDeletionParams) => Promise<void>;
};

export type LogActionParams = {
  userId: string;
  userName?: string;
  action: AuditAction;
  entityType: AuditEntityType;
  entityId: string;
  entityName?: string;
  metadata?: Record<string, any>;
  context?: {
    ipAddress?: string;
    userAgent?: string;
    sessionId?: string;
  };
};

export type LogCreationParams = Omit<LogActionParams, "action">;
export type LogDeletionParams = Omit<LogActionParams, "action">;

export type LogUpdateParams = LogActionParams & {
  changes: Array<{
    field: string;
    oldValue: any;
    newValue: any;
  }>;
};

/**
 * Factory für AuditLogService
 */
export const createAuditLogService = (
  auditLogRepository: IAuditLogRepository
): AuditLogService => ({
  logAction: async (params) => {
    const auditLog = createAuditLog({
      userId: params.userId,
      userName: params.userName,
      action: params.action,
      entityType: params.entityType,
      entityId: params.entityId,
      entityName: params.entityName,
      metadata: params.metadata,
      context: params.context
    });

    await auditLogRepository.create(auditLog);
  },

  logCreation: async (params) => {
    const auditLog = createAuditLog({
      ...params,
      action: "created"
    });

    await auditLogRepository.create(auditLog);
  },

  logUpdate: async (params) => {
    const changes: FieldChange[] = params.changes.map(change => ({
      field: change.field,
      oldValue: change.oldValue,
      newValue: change.newValue,
      fieldType: typeof change.newValue
    }));

    const auditLog = createAuditLog({
      userId: params.userId,
      userName: params.userName,
      action: "updated",
      entityType: params.entityType,
      entityId: params.entityId,
      entityName: params.entityName,
      changes,
      metadata: params.metadata,
      context: params.context
    });

    await auditLogRepository.create(auditLog);
  },

  logDeletion: async (params) => {
    const auditLog = createAuditLog({
      ...params,
      action: "deleted"
    });

    await auditLogRepository.create(auditLog);
  }
});

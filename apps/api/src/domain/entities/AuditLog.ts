// apps/api/src/domain/entities/AuditLog.ts
import { generateId } from "@faninitiative/shared";

export type AuditAction =
  | "created"
  | "updated"
  | "deleted"
  | "approved"
  | "rejected"
  | "status_changed"
  | "assigned"
  | "unassigned"
  | "viewed"
  | "exported";

export type AuditEntityType =
  | "event"
  | "member"
  | "task"
  | "finance"
  | "document"
  | "creator"
  | "approval_request";

export type AuditContext = {
  readonly ipAddress?: string;
  readonly userAgent?: string;
  readonly sessionId?: string;
  readonly requestId?: string;
};

export type FieldChange = {
  readonly field: string;
  readonly oldValue: any;
  readonly newValue: any;
  readonly fieldType?: string;
};

/**
 * AuditLog Entity
 * @description Protokolliert alle Änderungen im System für Compliance und Nachvollziehbarkeit
 */
export type AuditLog = {
  readonly id: string;
  readonly timestamp: Date;
  readonly userId: string;
  readonly userName?: string;
  readonly action: AuditAction;
  readonly entityType: AuditEntityType;
  readonly entityId: string;
  readonly entityName?: string;
  readonly changes?: FieldChange[];
  readonly metadata?: Record<string, any>;
  readonly context: AuditContext;
};

/**
 * Erstellt einen neuen Audit Log Eintrag
 */
export const createAuditLog = (params: {
  userId: string;
  userName?: string;
  action: AuditAction;
  entityType: AuditEntityType;
  entityId: string;
  entityName?: string;
  changes?: FieldChange[];
  metadata?: Record<string, any>;
  context?: AuditContext;
}): AuditLog => ({
  id: generateId(),
  timestamp: new Date(),
  userId: params.userId,
  userName: params.userName,
  action: params.action,
  entityType: params.entityType,
  entityId: params.entityId,
  entityName: params.entityName,
  changes: params.changes,
  metadata: params.metadata,
  context: params.context || {},
});

/**
 * Prüft ob eine Aktion sensitiv ist
 */
export const isSensitiveAction = (action: AuditAction): boolean => {
  const sensitiveActions: AuditAction[] = ["deleted", "approved", "rejected"];
  return sensitiveActions.includes(action);
};

/**
 * Anonymisiert sensitive Daten für Export
 */
export const anonymizeAuditLog = (log: AuditLog): AuditLog => ({
  ...log,
  context: {
    ...log.context,
    ipAddress: log.context.ipAddress ? "xxx.xxx.xxx.xxx" : undefined,
    sessionId: log.context.sessionId ? "anonymized" : undefined,
  },
  changes: log.changes?.map((change) => ({
    ...change,
    oldValue: isSensitiveField(change.field) ? "[REDACTED]" : change.oldValue,
    newValue: isSensitiveField(change.field) ? "[REDACTED]" : change.newValue,
  })),
});

const isSensitiveField = (fieldName: string): boolean => {
  const sensitiveFields = ["password", "iban", "geburtsdatum", "adresse"];
  return sensitiveFields.some((field) =>
    fieldName.toLowerCase().includes(field),
  );
};

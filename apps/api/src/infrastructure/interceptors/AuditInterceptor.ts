// apps/api/src/infrastructure/interceptors/AuditInterceptor.ts
import type { AuditLogService } from "@/application/services/AuditLogService";
import type { AuditEntityType } from "@/domain/entities/AuditLog";

/**
 * Audit Context für Requests
 */
export type AuditRequestContext = {
  userId: string;
  userName?: string;
  ipAddress?: string;
  userAgent?: string;
  sessionId?: string;
  requestId?: string;
};

/**
 * Audit Interceptor
 * @description Automatisches Audit Logging für alle Requests
 */
export type AuditInterceptor = {
  /**
   * Interceptor für Use Case Execution
   */
  intercept: <T>(
    useCaseName: string,
    params: any,
    context: AuditRequestContext,
    execute: () => Promise<T>,
  ) => Promise<T>;
};

/**
 * Factory für AuditInterceptor
 */
export const createAuditInterceptor = (
  auditLogService: AuditLogService,
): AuditInterceptor => ({
  intercept: async (useCaseName, params, context, execute) => {
    const startTime = Date.now();
    let result: any;
    let error: Error | null = null;

    try {
      // Execute the use case
      result = await execute();

      // Log successful actions
      const auditableAction = extractAuditableAction(
        useCaseName,
        params,
        result,
      );
      if (auditableAction) {
        await auditLogService.logAction({
          userId: context.userId,
          userName: context.userName,
          action: auditableAction.action,
          entityType: auditableAction.entityType,
          entityId: auditableAction.entityId,
          entityName: auditableAction.entityName,
          metadata: {
            useCaseName,
            duration: Date.now() - startTime,
            ...auditableAction.metadata,
          },
          context: {
            ipAddress: context.ipAddress,
            userAgent: context.userAgent,
            sessionId: context.sessionId,
          },
        });
      }

      return result;
    } catch (e) {
      error = e as Error;

      // Log failed actions
      await auditLogService.logAction({
        userId: context.userId,
        userName: context.userName,
        action: "rejected",
        entityType: extractEntityType(useCaseName),
        entityId: params.id || "unknown",
        metadata: {
          useCaseName,
          error: error.message,
          duration: Date.now() - startTime,
        },
        context: {
          ipAddress: context.ipAddress,
          userAgent: context.userAgent,
          sessionId: context.sessionId,
        },
      });

      throw error;
    }
  },
});

/**
 * Extrahiert auditierbare Aktionen aus Use Case Namen und Ergebnis
 */
const extractAuditableAction = (
  useCaseName: string,
  params: any,
  result: any,
): {
  action: any;
  entityType: AuditEntityType;
  entityId: string;
  entityName?: string;
  metadata?: any;
} | null => {
  // Create Use Cases
  if (useCaseName.includes("Create")) {
    return {
      action: "created",
      entityType: extractEntityType(useCaseName),
      entityId: result.id || result.eventId || result.memberId || "unknown",
      entityName: result.title || result.name,
      metadata: { created: true },
    };
  }

  // Update Use Cases
  if (useCaseName.includes("Update")) {
    return {
      action: "updated",
      entityType: extractEntityType(useCaseName),
      entityId: params.id || params.eventId || params.memberId,
      entityName: params.data?.title || params.data?.name,
      metadata: { modifiedFields: result.modifiedFields },
    };
  }

  // Delete Use Cases
  if (useCaseName.includes("Delete")) {
    return {
      action: "deleted",
      entityType: extractEntityType(useCaseName),
      entityId: params.id,
      metadata: { softDelete: useCaseName.includes("Soft") },
    };
  }

  // Approval Use Cases
  if (useCaseName.includes("Approve")) {
    return {
      action: "approved",
      entityType: extractEntityType(useCaseName),
      entityId: params.id,
      metadata: { approvalType: params.type },
    };
  }

  // Status Change Use Cases
  if (useCaseName.includes("ChangeStatus")) {
    return {
      action: "status_changed",
      entityType: extractEntityType(useCaseName),
      entityId: params.id,
      metadata: {
        oldStatus: params.oldStatus,
        newStatus: params.newStatus || params.status,
      },
    };
  }

  return null;
};

/**
 * Extrahiert Entity Type aus Use Case Namen
 */
const extractEntityType = (useCaseName: string): AuditEntityType => {
  const lowerCase = useCaseName.toLowerCase();

  if (lowerCase.includes("event")) return "event";
  if (lowerCase.includes("member")) return "member";
  if (lowerCase.includes("task")) return "task";
  if (lowerCase.includes("finance") || lowerCase.includes("ausgabe"))
    return "finance";
  if (lowerCase.includes("document")) return "document";
  if (lowerCase.includes("creator")) return "creator";
  if (lowerCase.includes("approval")) return "approval_request";

  return "event"; // Default
};

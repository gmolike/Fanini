// apps/api/src/infrastructure/decorators/AuditableRepository.ts
import type { AuditLogService } from "@/application/services/AuditLogService";
import type { AuditEntityType, FieldChange } from "@/domain/entities/AuditLog";

/**
 * Auditable Repository Decorator
 * @description Wrapper für Repositories mit automatischem Audit Logging
 */
export const createAuditableRepository = <T extends object>(
  repository: T,
  entityType: AuditEntityType,
  auditLogService: AuditLogService,
  getCurrentUser: () => { userId: string; userName?: string },
): T => {
  return new Proxy(repository, {
    get(target, prop, receiver) {
      const originalMethod = Reflect.get(target, prop, receiver);

      if (typeof originalMethod !== "function") {
        return originalMethod;
      }

      // Methoden die geloggt werden sollen
      const auditableMethods = [
        "save",
        "create",
        "update",
        "delete",
        "softDelete",
      ];
      const methodName = String(prop);

      if (!auditableMethods.some((m) => methodName.toLowerCase().includes(m))) {
        return originalMethod;
      }

      return async function (...args: any[]) {
        const user = getCurrentUser();
        const startTime = Date.now();

        try {
          // Get old state for updates
          let oldEntity: any = null;
          if (methodName.includes("update") && args[0]) {
            const findMethod = (target as any).findById;
            if (findMethod) {
              oldEntity = await findMethod.call(target, args[0]);
            }
          }

          // Execute original method
          const result = await originalMethod.apply(target, args);

          // Log the action
          if (methodName.includes("create") || methodName.includes("save")) {
            await auditLogService.logCreation({
              userId: user.userId,
              userName: user.userName,
              entityType,
              entityId: result.id,
              entityName: result.title || result.name,
              metadata: {
                method: methodName,
                duration: Date.now() - startTime,
              },
            });
          } else if (methodName.includes("update") && oldEntity) {
            const changes = detectChanges(oldEntity, args[1]);
            if (changes.length > 0) {
              await auditLogService.logUpdate({
                userId: user.userId,
                userName: user.userName,
                action: "updated",
                entityType,
                entityId: args[0],
                entityName: result.title || result.name,
                changes,
                metadata: {
                  method: methodName,
                  duration: Date.now() - startTime,
                },
              });
            }
          } else if (methodName.includes("delete")) {
            await auditLogService.logDeletion({
              userId: user.userId,
              userName: user.userName,
              entityType,
              entityId: args[0],
              metadata: {
                method: methodName,
                softDelete: methodName.includes("soft"),
                duration: Date.now() - startTime,
              },
            });
          }

          return result;
        } catch (error) {
          // Log failed operations
          await auditLogService.logAction({
            userId: user.userId,
            userName: user.userName,
            action: "rejected",
            entityType,
            entityId: args[0] || "unknown",
            metadata: {
              method: methodName,
              error: (error as Error).message,
              duration: Date.now() - startTime,
            },
          });

          throw error;
        }
      };
    },
  });
};

/**
 * Erkennt Änderungen zwischen zwei Objekten
 */
const detectChanges = (oldObj: any, newObj: any): FieldChange[] => {
  const changes: FieldChange[] = [];

  if (!newObj) return changes;

  for (const key in newObj) {
    if (newObj.hasOwnProperty(key)) {
      const oldValue = oldObj[key];
      const newValue = newObj[key];

      // Skip metadata fields
      if (key.includes("_at") || key.includes("_by")) continue;

      if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
        changes.push({
          field: key,
          oldValue,
          newValue,
        });
      }
    }
  }

  return changes;
};

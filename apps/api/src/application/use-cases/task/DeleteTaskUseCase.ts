// apps/api/src/application/use-cases/task/DeleteTaskUseCase.ts
import type { ITaskRepository } from "@/domain/repositories/ITaskRepository";
import type { AuditLogService } from "@/application/services/AuditLogService";
import {
  createNotFoundError,
  createPermissionError,
  createBusinessError
} from "@/application/dto/common";
import { Task } from "@/domain/entities";

/**
 * Delete Task Parameters
 */
export type DeleteTaskParams = {
  readonly taskId: string;
  readonly userId: string;
  readonly userRole: string;
  readonly userName?: string;
  readonly context?: {
    readonly ipAddress?: string;
    readonly userAgent?: string;
  };
};

/**
 * Delete Task Result
 */
export type DeleteTaskResult = {
  readonly success: boolean;
  readonly error?: any;
};

/**
 * Delete Task Use Case
 * @description Löscht eine Task (Soft Delete)
 */
export type DeleteTaskUseCase = {
  execute: (params: DeleteTaskParams) => Promise<DeleteTaskResult>;
};

export const createDeleteTaskUseCase = (
  taskRepository: ITaskRepository,
  auditLogService: AuditLogService
): DeleteTaskUseCase => ({
  execute: async ({ taskId, userId, userRole, userName, context }) => {
    try {
      // 1. Task laden
      const task = await taskRepository.findById(taskId);
      if (!task) {
        return {
          success: false,
          error: createNotFoundError("Task", taskId),
        };
      }

      // 2. Berechtigungsprüfung
      const canDelete = canDeleteTask(task, userId, userRole);
      if (!canDelete) {
        return {
          success: false,
          error: createPermissionError("Task löschen"),
        };
      }

      // 3. Status-Prüfung
      if (task.status !== "offen" && userRole !== "ADMIN") {
        return {
          success: false,
          error: createBusinessError("Nur offene Aufgaben können gelöscht werden"),
        };
      }

      // 4. Prüfen ob andere Tasks davon abhängen
      const allTasks = await taskRepository.findAll({ nurAktive: true });
      const hasDependents = allTasks.some(t =>
        t.abhaengigVon?.includes(taskId)
      );

      if (hasDependents) {
        return {
          success: false,
          error: createBusinessError(
            "Aufgabe kann nicht gelöscht werden, da andere Aufgaben davon abhängen"
          ),
        };
      }

      // 5. Soft Delete
      await taskRepository.softDelete(taskId);

      // 6. Audit Log
      await auditLogService.logDeletion({
        userId,
        userName,
        entityType: "task",
        entityId: taskId,
        entityName: task.titel,
        metadata: {
          taskStatus: task.status,
          hadAssignees: task.zugewiesenAn.length > 0,
          hadDependents: false,
        },
        context,
      });

      return {
        success: true,
      };

    } catch (error) {
      console.error("DeleteTaskUseCase error:", error);
      return {
        success: false,
        error: createBusinessError("Fehler beim Löschen der Task"),
      };
    }
  },
});

const canDeleteTask = (task: Task, userId: string, userRole: string): boolean => {
  if (userRole === "ADMIN") return true;

  // Nur Ersteller kann löschen, und nur wenn Task noch offen ist
  return task.erstelltVon === userId && task.status === "offen";
};

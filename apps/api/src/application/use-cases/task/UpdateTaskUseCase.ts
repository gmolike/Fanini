// apps/api/src/application/use-cases/task/UpdateTaskUseCase.ts
import type { ITaskRepository } from "@/domain/repositories/ITaskRepository";
import type { IMemberRepository } from "@/domain/repositories/IMemberRepository";
import type { AuditLogService } from "@/application/services/AuditLogService";
import type { UpdateTaskDTO, TaskDetailDTO } from "@/application/dto/task";
import type { Task } from "@/domain/entities/Task";
import {
  createPermissionError,
  createBusinessError,
  createNotFoundError,
  createValidationError,
} from "@/application/dto/common";

/**
 * Update Task Parameters
 */
export type UpdateTaskParams = {
  readonly taskId: string;
  readonly data: UpdateTaskDTO;
  readonly userId: string;
  readonly userRole: string;
  readonly userName?: string;
  readonly context?: {
    readonly ipAddress?: string;
    readonly userAgent?: string;
  };
};

/**
 * Update Task Result
 */
export type UpdateTaskResult = {
  readonly success: boolean;
  readonly task?: TaskDetailDTO;
  readonly error?: any;
  readonly modifiedFields?: string[];
};

/**
 * Update Task Use Case
 * @description Aktualisiert eine Task mit Berechtigungsprüfung und Audit Logging
 */
export type UpdateTaskUseCase = {
  execute: (params: UpdateTaskParams) => Promise<UpdateTaskResult>;
};

export const createUpdateTaskUseCase = (
  taskRepository: ITaskRepository,
  memberRepository: IMemberRepository,
  auditLogService: AuditLogService
): UpdateTaskUseCase => ({
  execute: async ({ taskId, data, userId, userRole, userName, context }) => {
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
      const canEdit = canEditTask(task, userId, userRole);
      if (!canEdit) {
        await auditLogService.logAction({
          userId,
          userName,
          action: "rejected",
          entityType: "task",
          entityId: taskId,
          metadata: {
            reason: "insufficient_permissions",
            attemptedAction: "update",
          },
          context,
        });

        return {
          success: false,
          error: createPermissionError("Task bearbeiten"),
        };
      }

      // 3. Status-spezifische Einschränkungen
      if (task.status === "erledigt" && userRole !== "ADMIN") {
        return {
          success: false,
          error: createBusinessError("Erledigte Aufgaben können nicht bearbeitet werden"),
        };
      }

      // 4. Validierungen
      if (data.verantwortlichId) {
        const responsible = await memberRepository.findById(data.verantwortlichId);
        if (!responsible || !responsible.ist_aktiv) {
          return {
            success: false,
            error: createBusinessError("Verantwortlicher muss ein aktives Mitglied sein"),
          };
        }
      }

      if (data.frist) {
        const fristDate = new Date(data.frist);
        if (fristDate < new Date() && task.status !== "erledigt") {
          return {
            success: false,
            error: createValidationError("frist", "Frist muss in der Zukunft liegen"),
          };
        }
      }

      // 5. Änderungen sammeln
      const changes = [];
      const modifiedFields: string[] = [];
      const updates: Partial<Task> = {};

      for (const [field, newValue] of Object.entries(data)) {
        if (field === "changeComment") continue;

        const oldValue = (task as any)[field];
        if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
          changes.push({ field, oldValue, newValue });
          modifiedFields.push(field);
          (updates as any)[field] = newValue;
        }
      }

      if (modifiedFields.length === 0) {
        return {
          success: true,
          task: await mapTaskToDetailDTO(task, userId, userRole, memberRepository, taskRepository),
          modifiedFields: [],
        };
      }

      // 6. Update durchführen
      if (data.frist) {
        updates.frist = new Date(data.frist);
      }

      const updatedTask = await taskRepository.update(taskId, updates);

      // 7. Audit Log
      await auditLogService.logUpdate({
        userId,
        userName,
        action: "updated",
        entityType: "task",
        entityId: taskId,
        entityName: task.titel,
        changes,
        metadata: {
          changeComment: data.changeComment,
          modifiedFieldCount: modifiedFields.length,
        },
        context,
      });

      // 8. Zu DTO mappen
      const taskDto = await mapTaskToDetailDTO(
        updatedTask,
        userId,
        userRole,
        memberRepository,
        taskRepository
      );

      return {
        success: true,
        task: taskDto,
        modifiedFields,
      };

    } catch (error) {
      console.error("UpdateTaskUseCase error:", error);
      return {
        success: false,
        error: createBusinessError("Fehler beim Aktualisieren der Task"),
      };
    }
  },
});

const canEditTask = (task: Task, userId: string, userRole: string): boolean => {
  if (["ADMIN", "VORSTAND", "BEIRAT"].includes(userRole)) return true;

  return task.verantwortlichId === userId ||
         task.zugewiesenAn.includes(userId) ||
         task.erstelltVon === userId;
};

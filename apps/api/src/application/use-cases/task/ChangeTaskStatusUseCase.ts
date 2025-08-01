// apps/api/src/application/use-cases/task/ChangeTaskStatusUseCase.ts
import type { ITaskRepository } from "@/domain/repositories/ITaskRepository";
import type { AuditLogService } from "@/application/services/AuditLogService";
import type { ChangeTaskStatusDTO, TaskDetailDTO } from "@/application/dto/task";
import type { Task, TaskStatus } from "@/domain/entities/Task";
import {
  createNotFoundError,
  createPermissionError,
  createBusinessError,
} from "@/application/dto/common";
import { IMemberRepository } from "@/domain/repositories";
import { mapTaskToDetailDTO } from "./helpers";

/**
 * Change Task Status Parameters
 */
export type ChangeTaskStatusParams = {
  readonly taskId: string;
  readonly data: ChangeTaskStatusDTO;
  readonly userId: string;
  readonly userRole: string;
  readonly userName?: string;
  readonly context?: {
    readonly ipAddress?: string;
    readonly userAgent?: string;
  };
};

/**
 * Change Task Status Result
 */
export type ChangeTaskStatusResult = {
  readonly success: boolean;
  readonly task?: TaskDetailDTO;
  readonly error?: any;
};

/**
 * Change Task Status Use Case
 * @description Ändert den Status einer Task mit Workflow-Validierung
 */
export type ChangeTaskStatusUseCase = {
  execute: (params: ChangeTaskStatusParams) => Promise<ChangeTaskStatusResult>;
};

export const createChangeTaskStatusUseCase = (
  taskRepository: ITaskRepository,
  memberRepository: IMemberRepository,
  auditLogService: AuditLogService
): ChangeTaskStatusUseCase => ({
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

      // 2. Workflow-Validierung
      const allowedTransitions = getAllowedStatusTransitions(task.status);
      if (!allowedTransitions.includes(data.status)) {
        return {
          success: false,
          error: createBusinessError(
            `Übergang von ${task.status} zu ${data.status} nicht erlaubt`
          ),
        };
      }

      // 3. Berechtigungsprüfung
      const canChange = canChangeTaskStatus(task, userId, userRole);
      if (!canChange) {
        return {
          success: false,
          error: createPermissionError("Task-Status ändern"),
        };
      }

      // 4. Status-spezifische Validierungen
      const validationResult = await validateStatusChange(
        task,
        data.status,
        taskRepository
      );
      if (!validationResult.valid) {
        return {
          success: false,
          error: createBusinessError(validationResult.error!),
        };
      }

      // 5. Status ändern
      const updates: Partial<Task> = {
        status: data.status,
      };

      if (data.status === "erledigt") {
        updates.erledigtAm = new Date();
        updates.erledigtVon = userId;
        if (data.actualHours) {
          // TODO: actualHours in Task Entity hinzufügen
        }
      }

      const updatedTask = await taskRepository.update(taskId, updates);

      // 6. Status-Änderungs-Kommentar
      const commentText = `Status geändert: ${task.status} → ${data.status}${
        data.comment ? `\n${data.comment}` : ""
      }`;

      await taskRepository.addComment({
        taskId,
        autorId: userId,
        text: commentText,
        erwaehntePersonen: [],
      });

      // 7. Audit Log
      await auditLogService.logAction({
        userId,
        userName,
        action: "status_changed",
        entityType: "task",
        entityId: taskId,
        entityName: task.titel,
        metadata: {
          workflow: "task_status",
          oldStatus: task.status,
          newStatus: data.status,
          changeReason: data.comment,
          actualHours: data.actualHours,
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
      };

    } catch (error) {
      console.error("ChangeTaskStatusUseCase error:", error);
      return {
        success: false,
        error: createBusinessError("Fehler beim Ändern des Task-Status"),
      };
    }
  },
});

const getAllowedStatusTransitions = (currentStatus: TaskStatus): TaskStatus[] => {
  const transitions: Record<TaskStatus, TaskStatus[]> = {
    "offen": ["in_bearbeitung", "blockiert"],
    "in_bearbeitung": ["review", "blockiert", "offen"],
    "review": ["erledigt", "in_bearbeitung", "blockiert"],
    "erledigt": [],
    "blockiert": ["offen", "in_bearbeitung"],
  };

  return transitions[currentStatus] || [];
};

const validateStatusChange = async (
  task: Task,
  newStatus: TaskStatus,
  taskRepository: ITaskRepository
): Promise<{ valid: boolean; error?: string }> => {
  if (newStatus === "erledigt") {
    // Prüfe Abhängigkeiten
    if (task.abhaengigVon && task.abhaengigVon.length > 0) {
      const dependencies = await Promise.all(
        task.abhaengigVon.map(id => taskRepository.findById(id))
      );

      const unfinished = dependencies.filter(
        dep => dep && dep.status !== "erledigt"
      );

      if (unfinished.length > 0) {
        return {
          valid: false,
          error: "Alle abhängigen Aufgaben müssen zuerst erledigt werden",
        };
      }
    }

    // Prüfe Materialien
    const unbeschaffteMaterialien = task.materialien.filter(m => !m.besorgt);
    if (unbeschaffteMaterialien.length > 0) {
      return {
        valid: false,
        error: "Alle Materialien müssen zuerst besorgt werden",
      };
    }
  }

  return { valid: true };
};

const canChangeTaskStatus = (task: Task, userId: string, userRole: string): boolean => {
  if (["ADMIN", "VORSTAND", "BEIRAT"].includes(userRole)) return true;

  return task.verantwortlichId === userId ||
         task.zugewiesenAn.includes(userId);
};

// apps/api/src/application/use-cases/task/CompleteTaskUseCase.ts
import type { ITaskRepository } from "@/domain/repositories/ITaskRepository";
import type { AuditLogService } from "@/application/services/AuditLogService";
import type { TaskDetailDTO } from "@/application/dto/task";
import type { Task } from "@/domain/entities/Task";
import {
  createNotFoundError,
  createPermissionError,
  createBusinessError
} from "@/application/dto/common";
import { IMemberRepository } from "@/domain/repositories";
import { mapTaskToDetailDTO } from "./helpers";

/**
 * Complete Task Parameters
 */
export type CompleteTaskParams = {
  readonly taskId: string;
  readonly kommentar?: string;
  readonly actualHours?: number;
  readonly userId: string;
  readonly userRole: string;
  readonly userName?: string;
};

/**
 * Complete Task Result
 */
export type CompleteTaskResult = {
  readonly success: boolean;
  readonly task?: TaskDetailDTO;
  readonly error?: any;
};

/**
 * Complete Task Use Case
 * @description Schließt eine Task ab
 */
export type CompleteTaskUseCase = {
  execute: (params: CompleteTaskParams) => Promise<CompleteTaskResult>;
};

export const createCompleteTaskUseCase = (
  taskRepository: ITaskRepository,
  memberRepository: IMemberRepository,
  auditLogService: AuditLogService
): CompleteTaskUseCase => ({
  execute: async ({ taskId, kommentar, actualHours, userId, userRole, userName }) => {
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
      const canComplete = canChangeTaskStatus(task, userId, userRole);
      if (!canComplete) {
        return {
          success: false,
          error: createPermissionError("Task abschließen"),
        };
      }

      // 3. Prüfe Abhängigkeiten
      if (task.abhaengigVon && task.abhaengigVon.length > 0) {
        const dependencies = await Promise.all(
          task.abhaengigVon.map(id => taskRepository.findById(id))
        );

        const unfinished = dependencies.filter(
          dep => dep && dep.status !== "erledigt"
        );

        if (unfinished.length > 0) {
          return {
            success: false,
            error: createBusinessError(
              "Alle abhängigen Aufgaben müssen zuerst erledigt werden"
            ),
          };
        }
      }

      // 4. Prüfe Materialien
      const unbeschaffteMaterialien = task.materialien.filter(m => !m.besorgt);
      if (unbeschaffteMaterialien.length > 0) {
        return {
          success: false,
          error: createBusinessError(
            `${unbeschaffteMaterialien.length} Materialien sind noch nicht besorgt`
          ),
        };
      }

      // 5. Task abschließen
      const updates: Partial<Task> = {
        status: "erledigt",
        erledigtAm: new Date(),
        erledigtVon: userId,
      };

      const updatedTask = await taskRepository.update(taskId, updates);

      // 6. Abschluss-Kommentar
      const commentText = `Aufgabe abgeschlossen.${
        kommentar ? ` ${kommentar}` : ""
      }${
        actualHours ? ` Tatsächlicher Aufwand: ${actualHours} Stunden.` : ""
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
          oldStatus: task.status,
          newStatus: "erledigt",
          actualHours,
          completionComment: kommentar,
        },
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
      console.error("CompleteTaskUseCase error:", error);
      return {
        success: false,
        error: createBusinessError("Fehler beim Abschließen der Task"),
      };
    }
  },
});

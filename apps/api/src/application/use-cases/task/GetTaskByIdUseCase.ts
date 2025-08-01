// apps/api/src/application/use-cases/task/GetTaskByIdUseCase.ts
import { createPermissionError } from "@/application/dto/common";
import type { TaskDetailDTO } from "@/application/dto/task";
import { Task } from "@/domain/entities";
import type { IMemberRepository } from "@/domain/repositories/IMemberRepository";
import type { ITaskRepository } from "@/domain/repositories/ITaskRepository";
import { mapTaskToDetailDTO } from "./helpers";

/**
 * Get Task By Id Parameters
 */
export type GetTaskByIdParams = {
  readonly taskId: string;
  readonly userId: string;
  readonly userRole: string;
};

/**
 * Get Task By Id Result
 */
export type GetTaskByIdResult = TaskDetailDTO | null;

/**
 * Get Task By Id Use Case
 * @description Lädt detaillierte Informationen einer Task
 */
export type GetTaskByIdUseCase = {
  execute: (params: GetTaskByIdParams) => Promise<GetTaskByIdResult>;
};

export const createGetTaskByIdUseCase = (
  taskRepository: ITaskRepository,
  memberRepository: IMemberRepository
): GetTaskByIdUseCase => ({
  execute: async ({ taskId, userId, userRole }) => {
    // 1. Task laden
    const task = await taskRepository.findById(taskId);
    if (!task) {
      return null;
    }

    // 2. Berechtigungsprüfung
    const canView = canViewTask(task, userId, userRole);
    if (!canView) {
      throw createPermissionError("Task anzeigen");
    }

    // 3. Zu Detail DTO mappen
    const taskDto = await mapTaskToDetailDTO(
      task,
      userId,
      userRole,
      memberRepository,
      taskRepository
    );

    return taskDto;
  },
});

const canViewTask = (task: Task, userId: string, userRole: string): boolean => {
  // Leadership kann alles sehen
  if (["ADMIN", "VORSTAND", "BEIRAT"].includes(userRole)) return true;

  // Beteiligt an der Task
  return task.verantwortlichId === userId ||
         task.zugewiesenAn.includes(userId) ||
         task.erstelltVon === userId;
};

// apps/api/src/application/use-cases/task/GetTasksByEventUseCase.ts
import type { ITaskRepository } from "@/domain/repositories/ITaskRepository";
import type { IEventRepository } from "@/domain/repositories/IEventRepository";
import type { IMemberRepository } from "@/domain/repositories/IMemberRepository";
import type { TaskListDTO } from "@/application/dto/task";
import { createNotFoundError } from "@/application/dto/common";
import { TaskStatus, Task } from "@/domain/entities";
import { identifyBlockedTasks, mapTasksToListDTOs } from "./helpers";

/**
 * Get Tasks By Event Parameters
 */
export type GetTasksByEventParams = {
  readonly eventId: string;
  readonly userId: string;
  readonly userRole: string;
};

/**
 * Get Tasks By Event Result
 */
export type GetTasksByEventResult = {
  readonly items: TaskListDTO[];
  readonly completionPercentage: number;
  readonly stats: {
    readonly total: number;
    readonly byStatus: Record<TaskStatus, number>;
    readonly critical: number;
    readonly overdue: number;
  };
};

/**
 * Get Tasks By Event Use Case
 * @description Lädt alle Tasks eines Events
 */
export type GetTasksByEventUseCase = {
  execute: (params: GetTasksByEventParams) => Promise<GetTasksByEventResult>;
};

export const createGetTasksByEventUseCase = (
  taskRepository: ITaskRepository,
  eventRepository: IEventRepository,
  memberRepository: IMemberRepository,
): GetTasksByEventUseCase => ({
  execute: async ({ eventId, userId, userRole }) => {
    // 1. Event prüfen
    const event = await eventRepository.findById(eventId);
    if (!event) {
      throw createNotFoundError("Event", eventId);
    }

    // 2. Tasks laden
    const tasks = await taskRepository.getTasksByEvent(eventId);

    // 3. Blockierte Tasks identifizieren
    const blockedTaskIds = await identifyBlockedTasks(tasks, taskRepository);

    // 4. Statistiken berechnen
    const now = new Date();
    const stats = {
      total: tasks.length,
      byStatus: tasks.reduce(
        (acc, task) => {
          acc[task.status] = (acc[task.status] || 0) + 1;
          return acc;
        },
        {} as Record<TaskStatus, number>,
      ),
      critical: tasks.filter((t) => t.prioritaet === "kritisch").length,
      overdue: tasks.filter(
        (t) => t.frist && new Date(t.frist) < now && t.status !== "erledigt",
      ).length,
    };

    // 5. Completion Percentage
    const completionPercentage = calculateOverallCompletion(tasks);

    // 6. Zu DTOs mappen
    const items = await mapTasksToListDTOs(
      tasks,
      userId,
      userRole,
      memberRepository,
      taskRepository,
      blockedTaskIds,
    );

    return {
      items,
      completionPercentage,
      stats,
    };
  },
});

const calculateOverallCompletion = (tasks: Task[]): number => {
  if (tasks.length === 0) return 100;

  const weights = {
    offen: 0,
    in_bearbeitung: 50,
    review: 90,
    erledigt: 100,
    blockiert: 0,
  };

  const totalProgress = tasks.reduce((sum, task) => {
    return sum + (weights[task.status] || 0);
  }, 0);

  return Math.round(totalProgress / tasks.length);
};

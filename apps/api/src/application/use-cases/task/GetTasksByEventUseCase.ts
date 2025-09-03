// apps/api/src/application/use-cases/task/GetTasksByEventUseCase.ts
import type { ITaskRepository } from "@/domain/repositories/ITaskRepository";
import type { IEventRepository } from "@/domain/repositories/IEventRepository";
import type { IMemberRepository } from "@/domain/repositories/IMemberRepository";
import type { TaskListItemDTO, TaskStatsDTO } from "@/application/dto/task";
import { mapTasksToListItems } from "./mappers/TaskMapper";
import { calculateTaskStats } from "./helpers/TaskStatsCalculator";
import { TaskPermissionService } from "@/application/services/TaskPermissionService";
import { Task, TaskStatus } from "@/domain/entities";

/**
 * Get Tasks By Event Use Case
 */
export type GetTasksByEventUseCase = {
  execute: (params: GetTasksByEventParams) => Promise<GetTasksByEventResult>;
};

export type GetTasksByEventParams = {
  readonly eventId: string;
  readonly userId: string;
  readonly userRole: string;
};

export type GetTasksByEventResult = {
  readonly success: boolean;
  readonly tasks?: ReadonlyArray<TaskListItemDTO>;
  readonly stats?: TaskStatsDTO;
  readonly eventInfo?: {
    readonly id: string;
    readonly title: string;
    readonly date: string;
    readonly status: string;
  };
  readonly completionPercentage?: number;
  readonly error?: string;
};

/**
 * Factory für GetTasksByEventUseCase
 */
export const createGetTasksByEventUseCase = (
  taskRepository: ITaskRepository,
  eventRepository: IEventRepository,
  memberRepository: IMemberRepository,
  taskPermissionService: TaskPermissionService
): GetTasksByEventUseCase => ({
  execute: async ({ eventId, userId, userRole }) => {
    try {
      // 1. Event prüfen
      const event = await eventRepository.findById(eventId);
      if (!event) {
        return {
          success: false,
          error: "Event nicht gefunden"
        };
      }

      // 2. Tasks abrufen
      const tasks = await taskRepository.getTasksByEvent(eventId);

      // 3. Zu DTOs mappen
      const taskItems = await mapTasksToListItems(tasks, {
        userId,
        userRole,
        memberRepository,
        taskRepository
      });

      // 4. Statistiken
      const stats = calculateTaskStats(tasks);

      // 5. Completion Percentage
      const completionPercentage = calculateEventCompletion(tasks);

      // 6. Event-Info
      const eventInfo = {
        id: event.id,
        title: event.title,
        date: event.date.toISOString(),
        status: event.status
      };

      return {
        success: true,
        tasks: taskItems,
        stats,
        eventInfo,
        completionPercentage
      };

    } catch (error) {
      console.error("GetTasksByEventUseCase error:", error);
      return {
        success: false,
        error: "Fehler beim Abrufen der Event-Tasks"
      };
    }
  }
});

const calculateEventCompletion = (tasks: ReadonlyArray<Task>): number => {
  if (tasks.length === 0) return 100;

  const weights: Record<TaskStatus, number> = {
    'offen': 0,
    'in_bearbeitung': 50,
    'review': 90,
    'erledigt': 100,
    'blockiert': 0
  };

  const totalProgress = tasks.reduce((sum, task) =>
    sum + (weights[task.status] || 0), 0
  );

  return Math.round(totalProgress / tasks.length);
};

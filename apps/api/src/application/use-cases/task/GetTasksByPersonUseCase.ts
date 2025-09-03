// apps/api/src/application/use-cases/task/GetTasksByPersonUseCase.ts
import type { ITaskRepository } from "@/domain/repositories/ITaskRepository";
import type { IMemberRepository } from "@/domain/repositories/IMemberRepository";
import type { TaskListItemDTO, TaskStatsDTO } from "@/application/dto/task";
import { mapTasksToListItems } from "./mappers/TaskMapper";
import { calculateTaskStats } from "./helpers/TaskStatsCalculator";
import { TaskPermissionService } from "@/application/services/TaskPermissionService";

/**
 * Get Tasks By Person Use Case
 */
export type GetTasksByPersonUseCase = {
  execute: (params: GetTasksByPersonParams) => Promise<GetTasksByPersonResult>;
};

export type GetTasksByPersonParams = {
  readonly personId: string;
  readonly userId: string;
  readonly userRole: string;
  readonly includeCompleted?: boolean;
};

export type GetTasksByPersonResult = {
  readonly success: boolean;
  readonly tasks?: ReadonlyArray<TaskListItemDTO>;
  readonly stats?: TaskStatsDTO;
  readonly error?: string;
};

export type TaskSummaryDTO = {
  readonly total: number;
  readonly asVerantwortlicher: number;
  readonly asZugewiesener: number;
  readonly asErsteller: number;
};

/**
 * Factory für GetTasksByPersonUseCase
 */
export const createGetTasksByPersonUseCase = (
  taskRepository: ITaskRepository,
  memberRepository: IMemberRepository,
  taskPermissionService: TaskPermissionService,
): GetTasksByPersonUseCase => ({
  execute: async ({ personId, userId, userRole, includeCompleted = false }) => {
    try {
      // 1. Berechtigung prüfen
      const canViewOthersTasks = ["ADMIN", "VORSTAND", "BEIRAT"].includes(
        userRole,
      );
      if (personId !== userId && !canViewOthersTasks) {
        return {
          success: false,
          error: "Keine Berechtigung für diese Ansicht",
        };
      }

      // 2. Tasks abrufen
      const tasks = await taskRepository.getTasksByMember(personId);

      // 3. Filter anwenden
      const filteredTasks = includeCompleted
        ? tasks
        : tasks.filter((t) => t.status !== "erledigt");

      // 4. Nur sichtbare Tasks
      const visibleTasks = filteredTasks.filter((task) =>
        taskPermissionService.canViewTask(task, userId, userRole),
      );

      // 5. Zu DTOs mappen
      const taskItems = await mapTasksToListItems(visibleTasks, {
        userId,
        userRole,
        memberRepository,
        taskRepository,
      });

      // 6. Statistiken
      const stats = calculateTaskStats(visibleTasks);

      return {
        success: true,
        tasks: taskItems,
        stats,
      };
    } catch (error) {
      console.error("GetTasksByPersonUseCase error:", error);
      return {
        success: false,
        error: "Fehler beim Abrufen der persönlichen Tasks",
      };
    }
  },
});

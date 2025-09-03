// apps/api/src/application/use-cases/task/GetTasksUseCase.ts
import type { TaskListResponseDTO, TaskQueryDTO } from "@/application/dto/task";
import { TaskStatsDTO } from "@/application/dto/task/TaskQueryDTO";
import { TaskPermissionService } from "@/application/services/TaskPermissionService";
import { Task, TaskPriority, TaskStatus } from "@/domain/entities";
import { IMemberRepository } from "@/domain/repositories";
import type { ITaskRepository } from "@/domain/repositories/ITaskRepository";
import { mapTasksToListItems } from "./mappers/TaskMapper";

/**
 * Get Tasks Use Case
 */
export type GetTasksUseCase = {
  execute: (params: GetTasksParams) => Promise<GetTasksResult>;
};

export type GetTasksParams = {
  readonly filters: TaskQueryDTO;
  readonly userId: string;
  readonly userRole: string;
};

export type GetTasksResult = {
  readonly success: boolean;
  readonly data?: TaskListResponseDTO;
  readonly error?: string;
};

/**
 * Factory für GetTasksUseCase
 */
export const createGetTasksUseCase = (
  taskRepository: ITaskRepository,
  memberRepository: IMemberRepository,
  taskPermissionService: TaskPermissionService,
): GetTasksUseCase => ({
  execute: async ({ filters, userId, userRole }) => {
    try {
      // 1. Filters anpassen
      const repositoryFilters = {
        contextType: filters.contextType,
        contextId: filters.contextId,
        status: filters.status,
        prioritaet: filters.prioritaet,
        zugewiesenAn: filters.nurMeine ? userId : filters.zugewiesenAn,
        verantwortlichId: filters.verantwortlichId,
        kategorie: filters.kategorie,
        nurAktive: filters.nurAktive ?? true,
        istStandardaufgabe: filters.istStandardaufgabe,
      };

      // 2. Tasks abrufen
      const tasks = await taskRepository.findAll(repositoryFilters);

      // 3. Nur Tasks filtern, die der User sehen darf
      const visibleTasks = tasks.filter((task) =>
        taskPermissionService.canViewTask(task, userId, userRole),
      );

      // 4. Pagination
      const page = filters.page || 1;
      const limit = filters.limit || 20;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedTasks = visibleTasks.slice(startIndex, endIndex);

      // 5. Zu DTOs mappen
      const items = await mapTasksToListItems(paginatedTasks, {
        userId,
        userRole,
        memberRepository,
        taskRepository,
      });

      // 6. Statistiken berechnen
      const stats = calculateTaskStats(visibleTasks);

      return {
        success: true,
        data: {
          items,
          pagination: {
            page,
            limit,
            total: visibleTasks.length,
            totalPages: Math.ceil(visibleTasks.length / limit),
          },
          stats,
        },
      };
    } catch (error) {
      console.error("GetTasksUseCase error:", error);
      return {
        success: false,
        error: "Fehler beim Abrufen der Tasks",
      };
    }
  },
});

/**
 * Berechnet Task-Statistiken
 */

const calculateTaskStats = (tasks: ReadonlyArray<Task>): TaskStatsDTO => {
  const now = new Date();
  const inThreeDays = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);

  // Initialisiere mit reduce statt Mutation
  const statusCounts = tasks.reduce(
    (acc, task) => ({
      ...acc,
      [task.status]: (acc[task.status] || 0) + 1,
    }),
    {
      offen: 0,
      in_bearbeitung: 0,
      review: 0,
      erledigt: 0,
      blockiert: 0,
    } as Record<TaskStatus, number>,
  );

  const priorityCounts = tasks.reduce(
    (acc, task) => ({
      ...acc,
      [task.prioritaet]: (acc[task.prioritaet] || 0) + 1,
    }),
    {
      niedrig: 0,
      mittel: 0,
      hoch: 0,
      kritisch: 0,
    } as Record<TaskPriority, number>,
  );

  const overdue = tasks.filter(
    (task) => task.frist && task.frist < now && task.status !== "erledigt",
  ).length;

  const dueSoon = tasks.filter(
    (task) =>
      task.frist &&
      task.frist >= now &&
      task.frist <= inThreeDays &&
      task.status !== "erledigt",
  ).length;

  const blocked = tasks.filter(
    (task) =>
      task.status === "blockiert" ||
      (task.abhaengigVon && task.abhaengigVon.length > 0),
  ).length;

  return {
    total: tasks.length,
    byStatus: statusCounts,
    byPriority: priorityCounts,
    overdue,
    dueSoon,
    blocked,
  };
};

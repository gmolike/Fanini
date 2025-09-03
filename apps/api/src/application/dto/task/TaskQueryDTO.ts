// apps/api/src/application/dto/task/TaskQueryDTO.ts
import type { TaskStatus, TaskPriority } from "@/domain/entities/Task";
import { TaskListItemDTO } from "./TaskResponseDTO";

/**
 * Query-Parameter für Task-Abfragen
 */
export type TaskQueryDTO = {
  readonly contextType?: "event" | "team" | "general";
  readonly contextId?: string;
  readonly status?: ReadonlyArray<TaskStatus>;
  readonly prioritaet?: ReadonlyArray<TaskPriority>;
  readonly zugewiesenAn?: string;
  readonly verantwortlichId?: string;
  readonly kategorie?: string;
  readonly nurMeine?: boolean;
  readonly nurAktive?: boolean;
  readonly istStandardaufgabe?: boolean;
  readonly page?: number;
  readonly limit?: number;
  readonly sortBy?: TaskSortField;
  readonly sortOrder?: 'asc' | 'desc';
};

export type TaskSortField =
  | 'erstelltAm'
  | 'aktualisiertAm'
  | 'frist'
  | 'prioritaet'
  | 'status';

/**
 * Paginierte Task-Response
 */
export type TaskListResponseDTO = {
  readonly items: ReadonlyArray<TaskListItemDTO>;
  readonly pagination: {
    readonly page: number;
    readonly limit: number;
    readonly total: number;
    readonly totalPages: number;
  };
  readonly stats?: TaskStatsDTO;
};

/**
 * Task-Statistiken
 */
export type TaskStatsDTO = {
  readonly total: number;
  readonly byStatus: Record<TaskStatus, number>;
  readonly byPriority: Record<TaskPriority, number>;
  readonly overdue: number;
  readonly dueSoon: number;
  readonly blocked: number;
};

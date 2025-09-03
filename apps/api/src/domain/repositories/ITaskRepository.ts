// apps/api/src/domain/repositories/ITaskRepository.ts
import type { Task, TaskStatus, TaskPriority } from "../entities/Task";
import type { TaskComment } from "../entities/TaskComment";

/**
 * Filter-Optionen für Task-Abfragen
 */
export type TaskFilters = {
  readonly contextType?: "event" | "team" | "general";
  readonly contextId?: string;
  readonly status?: ReadonlyArray<TaskStatus>;
  readonly prioritaet?: ReadonlyArray<TaskPriority>;
  readonly zugewiesenAn?: string;
  readonly verantwortlichId?: string;
  readonly frist?: {
    readonly von?: Date;
    readonly bis?: Date;
  };
  readonly nurAktive?: boolean;
  readonly kategorie?: string;
  readonly istStandardaufgabe?: boolean;
};

/**
 * Task Repository Interface
 */
export type ITaskRepository = {
  // CRUD Operations
  create: (task: Omit<Task, "id" | "erstelltAm" | "aktualisiertAm">) => Promise<Task>;
  update: (id: string, updates: Partial<Task>) => Promise<Task>;
  findById: (id: string) => Promise<Task | null>;
  findAll: (filters?: TaskFilters) => Promise<ReadonlyArray<Task>>;
  softDelete: (id: string) => Promise<void>;

  // Assignments
  assignMembers: (taskId: string, memberIds: ReadonlyArray<string>, assignedBy: string) => Promise<void>;
  unassignMember: (taskId: string, memberId: string) => Promise<void>;
  getAssignedMembers: (taskId: string) => Promise<ReadonlyArray<string>>;

  // Comments
  addComment: (comment: Omit<TaskComment, "id" | "erstelltAm">) => Promise<TaskComment>;
  getComments: (taskId: string) => Promise<ReadonlyArray<TaskComment>>;

  // Relations
  getTasksByEvent: (eventId: string) => Promise<ReadonlyArray<Task>>;
  getTasksByTeam: (teamId: string) => Promise<ReadonlyArray<Task>>;
  getTasksByMember: (memberId: string) => Promise<ReadonlyArray<Task>>;

  // Dependencies
  getDependentTasks: (taskId: string) => Promise<ReadonlyArray<Task>>;
  getBlockedTasks: (taskId: string) => Promise<ReadonlyArray<Task>>;
};

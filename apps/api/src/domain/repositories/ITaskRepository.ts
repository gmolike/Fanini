// apps/api/src/domain/repositories/ITaskRepository.ts
import { Task, TaskStatus, TaskPriority } from "../entities/Task";
import { TaskAssignment } from "../entities/TaskAssignment";
import { TaskComment } from "../entities/TaskComment";

export type TaskFilters = {
  contextType?: "event" | "team" | "general";
  contextId?: string;
  status?: TaskStatus[];
  prioritaet?: TaskPriority[];
  zugewiesenAn?: string;
  verantwortlichId?: string;
  frist?: { von?: Date; bis?: Date };
  nurAktive?: boolean;
  kategorie?: string;
};

export type TaskAuditLogEntry = {
  taskId: string;
  aktion: string;
  ausgefuehrtVon: string;
  alteWerte?: any;
  neueWerte?: any;
  ipAdresse?: string;
  userAgent?: string;
};

export interface ITaskRepository {
  create(
    task: Omit<Task, "id" | "erstelltAm" | "aktualisiertAm">,
  ): Promise<Task>;
  update(id: string, updates: Partial<Task>): Promise<Task>;
  findById(id: string): Promise<Task | null>;
  findAll(filters?: TaskFilters): Promise<Task[]>;
  softDelete(id: string): Promise<void>;

  // Assignments
  assignMembers(
    taskId: string,
    memberIds: string[],
    assignedBy: string,
  ): Promise<void>;
  unassignMember(taskId: string, memberId: string): Promise<void>;
  getAssignments(taskId: string): Promise<TaskAssignment[]>;

  // Comments
  addComment(
    comment: Omit<TaskComment, "id" | "erstelltAm">,
  ): Promise<TaskComment>;
  getComments(taskId: string): Promise<TaskComment[]>;

  // Relations
  getTasksByEvent(eventId: string): Promise<Task[]>;
  getTasksByTeam(teamId: string): Promise<Task[]>;
  getMyTasks(memberId: string): Promise<Task[]>;

  // Audit
  createAuditLog(entry: TaskAuditLogEntry): Promise<void>;
}

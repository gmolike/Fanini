// apps/api/src/application/dto/task/CreateTaskDTO.ts
import type { TaskPriority, TaskMaterial } from "@/domain/entities/Task";

/**
 * Create Task DTO
 * @description Daten für Task-Erstellung
 */
export type CreateTaskDTO = {
  readonly titel: string;
  readonly beschreibung?: string;
  readonly context: {
    readonly type: "event" | "team" | "general";
    readonly id?: string;
  };
  readonly verantwortlichId?: string;
  readonly zugewiesenAn?: string[];
  readonly prioritaet: TaskPriority;
  readonly frist?: string;
  readonly materialien?: Omit<TaskMaterial, "besorgt">[];
  readonly abhaengigVon?: string[];
  readonly kategorie?: string;
  readonly istStandardaufgabe?: boolean;
};

/**
 * Update Task DTO
 * @description Daten für Task-Aktualisierung
 */
export type UpdateTaskDTO = {
  readonly titel?: string;
  readonly beschreibung?: string;
  readonly verantwortlichId?: string;
  readonly prioritaet?: TaskPriority;
  readonly frist?: string;
  readonly kategorie?: string;
  readonly changeComment?: string;
};

/**
 * Bulk Assign Tasks DTO
 * @description Mehrfach-Zuweisung von Tasks
 */
export type BulkAssignTasksDTO = {
  readonly taskIds: string[];
  readonly assignTo?: string[];
  readonly removeFrom?: string[];
  readonly comment?: string;
};

/**
 * Task Status Change DTO
 * @description Status-Änderung mit Begründung
 */
export type ChangeTaskStatusDTO = {
  readonly status: TaskStatus;
  readonly comment?: string;
  readonly actualHours?: number; // Bei Abschluss
};

/**
 * Task Material Update DTO
 * @description Material-Status aktualisieren
 */
export type UpdateTaskMaterialDTO = {
  readonly materialIndex: number;
  readonly besorgt: boolean;
  readonly besorgtVon?: string;
  readonly kommentar?: string;
};

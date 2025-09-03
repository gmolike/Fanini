// apps/api/src/application/dto/task/CreateTaskDTO.ts
import type { TaskPriority, TaskMaterial, TaskStatus } from "@/domain/entities/Task";

/**
 * DTO für Task-Erstellung
 */
export type CreateTaskDTO = {
  readonly titel: string;
  readonly beschreibung?: string;
  readonly context: {
    readonly type: "event" | "team" | "general";
    readonly id?: string;
  };
  readonly verantwortlichId?: string;
  readonly zugewiesenAn?: ReadonlyArray<string>;
  readonly prioritaet: TaskPriority;
  readonly frist?: string;
  readonly materialien?: ReadonlyArray<
    Omit<TaskMaterial, "besorgt" | "besorgtVon" | "besorgtAm">
  >;
  readonly abhaengigVon?: ReadonlyArray<string>;
  readonly kategorie?: string;
  readonly istStandardaufgabe?: boolean;
};

/**
 * DTO für Task-Aktualisierung
 */
export type UpdateTaskDTO = Partial<{
  readonly titel: string;
  readonly beschreibung: string;
  readonly verantwortlichId: string;
  readonly prioritaet: TaskPriority;
  readonly frist: string;
  readonly kategorie: string;
}>;

/**
 * DTO für Status-Änderung
 */
export type ChangeTaskStatusDTO = {
  readonly status: TaskStatus;
  readonly comment?: string;
  readonly actualHours?: number;
};

/**
 * DTO für Task-Zuweisung
 */
export type AssignTaskDTO = {
  readonly memberIds: ReadonlyArray<string>;
  readonly comment?: string;
};

/**
 * DTO für Kommentar
 */
export type AddCommentDTO = {
  readonly text: string;
  readonly erwaehntePersonen?: ReadonlyArray<string>;
};

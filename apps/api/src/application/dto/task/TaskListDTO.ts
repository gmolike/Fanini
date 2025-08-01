// apps/api/src/application/dto/task/TaskListDTO.ts
import type { TaskStatus, TaskPriority } from "@/domain/entities/Task";

/**
 * Task List DTO
 * @description Task-Informationen für Listen (nur intern)
 */
export type TaskListDTO = {
  readonly id: string;
  readonly titel: string;
  readonly beschreibung?: string;
  readonly status: TaskStatus;
  readonly prioritaet: TaskPriority;
  readonly frist?: string;
  readonly kategorie?: string;
  readonly context: {
    readonly type: "event" | "team" | "general";
    readonly id?: string;
    readonly name?: string;
  };
  readonly verantwortlicher?: {
    readonly id: string;
    readonly name: string;
    readonly avatarUrl?: string;
  };
  readonly zugewiesenePersonen: Array<{
    readonly id: string;
    readonly name: string;
    readonly avatarUrl?: string;
  }>;
  readonly istStandardaufgabe: boolean;
  readonly materialienStatus?: {
    readonly total: number;
    readonly besorgt: number;
  };
  readonly abhaengigVon?: string[];
  readonly istBlockiert: boolean;
  readonly erstelltVon: {
    readonly id: string;
    readonly name: string;
  };
  readonly erstelltAm: string;
  readonly aktualisiertAm: string;
  readonly completionPercentage: number;
  readonly permissions: TaskPermissionsDTO;
};

/**
 * Task Permissions DTO
 * @description Was darf der aktuelle Nutzer mit dieser Task?
 */
export type TaskPermissionsDTO = {
  readonly canEdit: boolean;
  readonly canDelete: boolean;
  readonly canChangeStatus: boolean;
  readonly canAssign: boolean;
  readonly canComment: boolean;
  readonly canViewDetails: boolean;
};

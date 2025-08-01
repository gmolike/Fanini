// apps/api/src/application/dto/task/TaskDetailDTO.ts
import type { TaskPermissionsDTO } from "./TaskListDTO";
import type { TaskMaterial, TaskStatus, TaskPriority } from "@/domain/entities/Task";

/**
 * Task Detail DTO
 * @description Vollständige Task-Details (nur intern)
 */
export type TaskDetailDTO = {
  readonly id: string;
  readonly titel: string;
  readonly beschreibung?: string;
  readonly status: TaskStatus;
  readonly prioritaet: TaskPriority;
  readonly frist?: string;
  readonly context: {
    readonly type: "event" | "team" | "general";
    readonly id?: string;
    readonly name?: string;
    readonly details?: any;
  };
  readonly verantwortlicher?: UserReferenceDTO;
  readonly zugewiesenePersonen: UserReferenceDTO[];
  readonly materialien: TaskMaterial[];
  readonly abhaengigVon?: TaskDependencyDTO[];
  readonly istStandardaufgabe: boolean;
  readonly kategorie?: string;
  readonly kommentare: TaskCommentDTO[];
  readonly history: TaskHistoryDTO[];
  readonly metadata: TaskMetadataDTO;
  readonly permissions: TaskPermissionsDTO;
  readonly auditLog?: AuditLogEntryDTO[];
};

/**
 * User Reference DTO
 */
export type UserReferenceDTO = {
  readonly id: string;
  readonly name: string;
  readonly email?: string;
  readonly avatarUrl?: string;
  readonly role?: string;
};

/**
 * Task Dependency DTO
 */
export type TaskDependencyDTO = {
  readonly taskId: string;
  readonly titel: string;
  readonly status: TaskStatus;
  readonly istErledigt: boolean;
  readonly blockiertAktuell: boolean;
};

/**
 * Task Comment DTO
 */
export type TaskCommentDTO = {
  readonly id: string;
  readonly text: string;
  readonly autor: UserReferenceDTO;
  readonly erstelltAm: string;
  readonly erwaehntePersonen?: UserReferenceDTO[];
  readonly istIntern: boolean;
};

/**
 * Task History DTO
 */
export type TaskHistoryDTO = {
  readonly aktion: "created" | "updated" | "status_changed" | "assigned" | "unassigned" | "completed";
  readonly ausgefuehrtVon: UserReferenceDTO;
  readonly ausgefuehrtAm: string;
  readonly details?: {
    readonly field?: string;
    readonly oldValue?: any;
    readonly newValue?: any;
  };
};

/**
 * Task Metadata DTO
 */
export type TaskMetadataDTO = {
  readonly erstelltAm: string;
  readonly aktualisiertAm: string;
  readonly erledigtAm?: string;
  readonly erledigtVon?: UserReferenceDTO;
  readonly geschaetzteStunden?: number;
  readonly tatsaechlicheStunden?: number;
  readonly versionsnummer: number;
};

/**
 * Audit Log Entry DTO
 */
export type AuditLogEntryDTO = {
  readonly action: string;
  readonly field?: string;
  readonly oldValue?: string;
  readonly newValue?: string;
  readonly changedBy: UserReferenceDTO;
  readonly changedAt: string;
  readonly comment?: string;
};

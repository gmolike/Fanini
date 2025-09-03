// apps/api/src/application/dto/task/TaskResponseDTO.ts
import type { TaskStatus, TaskPriority, TaskMaterial } from "@/domain/entities/Task";

/**
 * User-Referenz in Responses
 */
export type UserReferenceDTO = {
  readonly id: string;
  readonly name: string;
  readonly email?: string;
  readonly avatarUrl?: string;
  readonly role?: string;
};

/**
 * Task-Kontext in Responses
 */
export type TaskContextDTO = {
  readonly type: "event" | "team" | "general";
  readonly id?: string;
  readonly name?: string;
};

/**
 * Task Permissions für aktuellen User
 */
export type TaskPermissionsDTO = {
  readonly canEdit: boolean;
  readonly canDelete: boolean;
  readonly canChangeStatus: boolean;
  readonly canAssign: boolean;
  readonly canComment: boolean;
  readonly canViewDetails: boolean;
};

/**
 * Task in Listen-Ansicht
 */
export type TaskListItemDTO = {
  readonly id: string;
  readonly titel: string;
  readonly status: TaskStatus;
  readonly prioritaet: TaskPriority;
  readonly frist?: string;
  readonly context: TaskContextDTO;
  readonly verantwortlicher?: UserReferenceDTO;
  readonly zugewieseneAnzahl: number;
  readonly istUeberfaellig: boolean;
  readonly istBlockiert: boolean;
  readonly completionPercentage: number;
  readonly permissions: TaskPermissionsDTO;
};

/**
 * Detaillierte Task-Ansicht
 */
export type TaskDetailDTO = {
  readonly id: string;
  readonly titel: string;
  readonly beschreibung?: string;
  readonly status: TaskStatus;
  readonly prioritaet: TaskPriority;
  readonly frist?: string;
  readonly context: TaskContextDTO;
  readonly verantwortlicher?: UserReferenceDTO;
  readonly zugewiesenePersonen: ReadonlyArray<UserReferenceDTO>;
  readonly materialien: ReadonlyArray<TaskMaterial>;
  readonly abhaengigVon?: ReadonlyArray<TaskDependencyDTO>;
  readonly istStandardaufgabe: boolean;
  readonly kategorie?: string;
  readonly kommentare: ReadonlyArray<TaskCommentDTO>;
  readonly history: ReadonlyArray<TaskHistoryDTO>;
  readonly metadata: TaskMetadataDTO;
  readonly permissions: TaskPermissionsDTO;
};

/**
 * Task-Abhängigkeit
 */
export type TaskDependencyDTO = {
  readonly taskId: string;
  readonly titel: string;
  readonly status: TaskStatus;
  readonly istErledigt: boolean;
  readonly blockiertAktuell: boolean;
};

/**
 * Task-Kommentar
 */
export type TaskCommentDTO = {
  readonly id: string;
  readonly text: string;
  readonly autor: UserReferenceDTO;
  readonly erstelltAm: string;
  readonly erwaehntePersonen?: ReadonlyArray<UserReferenceDTO>;
};

/**
 * Task-Historie
 */
export type TaskHistoryDTO = {
  readonly aktion: string;
  readonly ausgefuehrtVon: UserReferenceDTO;
  readonly ausgefuehrtAm: string;
  readonly details?: Record<string, any>;
};

/**
 * Task-Metadaten
 */
export type TaskMetadataDTO = {
  readonly erstelltAm: string;
  readonly aktualisiertAm: string;
  readonly erledigtAm?: string;
  readonly erledigtVon?: UserReferenceDTO;
  readonly geschaetzteStunden?: number;
  readonly tatsaechlicheStunden?: number;
};

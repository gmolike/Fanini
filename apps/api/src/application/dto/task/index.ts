// List DTOs
export type { TaskListDTO, TaskPermissionsDTO } from "./TaskListDTO";

// Detail DTOs
export type {
  TaskDetailDTO,
  UserReferenceDTO,
  TaskDependencyDTO,
  TaskCommentDTO,
  TaskHistoryDTO,
  TaskMetadataDTO,
  AuditLogEntryDTO,
} from "./TaskDetailDTO";

// Create/Update DTOs
export type {
  CreateTaskDTO,
  UpdateTaskDTO,
  BulkAssignTasksDTO,
  ChangeTaskStatusDTO,
  UpdateTaskMaterialDTO,
} from "./CreateTaskDTO";

// Report DTOs
export type { TaskReportDTO, TaskTemplateDTO } from "./TaskReportDTO";

// Summary DTOs
export type { TaskSummaryDTO } from "./TaskSummaryDTO";

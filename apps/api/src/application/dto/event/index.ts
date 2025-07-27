// apps/api/src/application/dto/event/index.ts

// List DTOs
export {
  type PublicEventListDTO,
  type InternalEventListDTO,
  type EventLocationDTO,
  type MemberReferenceDTO,
  type EventPermissionsDTO,
  type EventTypeDTO,
  type SportBereichDTO,
  type EventStatusDTO,
} from "./EventListDTO";

// Detail DTOs
export {
  type PublicEventDetailDTO,
  type InternalEventDetailDTO,
  type PublicParticipantDTO,
  type EventMediaDTO,
  type PublicTaskDTO,
  type TaskDTO,
  type MaterialDTO,
  type CommentDTO,
  type BudgetBreakdownDTO,
  type AuditLogEntryDTO,
  type EventMetadataDTO,
} from "./EventDetailDTO";

// Create/Update DTOs
export {
  type CreateEventDTO,
  type CreateEventLocationDTO,
  CREATE_EVENT_VALIDATION,
} from "./CreateEventDTO";

export {
  type UpdateEventDTO,
  type ChangeEventStatusDTO,
  LOCKED_FIELDS_AFTER_APPROVAL,
  isFieldEditableAfterApproval,
} from "./UpdateEventDTO";

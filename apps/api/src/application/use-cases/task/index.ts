// apps/api/src/application/use-cases/task/index.ts

// CRUD Operations
export { createCreateTaskUseCase } from "./CreateTaskUseCase";
export type {
  CreateTaskParams,
  CreateTaskResult,
  CreateTaskUseCase,
} from "./CreateTaskUseCase";

export { createUpdateTaskUseCase } from "./UpdateTaskUseCase";
export type {
  UpdateTaskParams,
  UpdateTaskResult,
  UpdateTaskUseCase,
} from "./UpdateTaskUseCase";

export { createDeleteTaskUseCase } from "./DeleteTaskUseCase";
export type {
  DeleteTaskParams,
  DeleteTaskResult,
  DeleteTaskUseCase,
} from "./DeleteTaskUseCase";

export { createGetTaskByIdUseCase } from "./GetTaskByIdUseCase";
export type {
  GetTaskByIdParams,
  GetTaskByIdResult,
  GetTaskByIdUseCase,
} from "./GetTaskByIdUseCase";

// Task Lists
export { createGetTasksByPersonUseCase } from "./GetTasksByPersonUseCase";
export type {
  GetTasksByPersonParams,
  GetTasksByPersonResult,
  GetTasksByPersonUseCase,
  TaskSummaryDTO,
} from "./GetTasksByPersonUseCase";

export { createGetTasksByTeamUseCase } from "./GetTasksByTeamUseCase";
export type {
  GetTasksByTeamParams,
  GetTasksByTeamResult,
  GetTasksByTeamUseCase,
} from "./GetTasksByTeamUseCase";

export { createGetTasksByEventUseCase } from "./GetTasksByEventUseCase";
export type {
  GetTasksByEventParams,
  GetTasksByEventResult,
  GetTasksByEventUseCase,
} from "./GetTasksByEventUseCase";

// Task Workflow
export { createChangeTaskStatusUseCase } from "./ChangeTaskStatusUseCase";
export type {
  ChangeTaskStatusParams,
  ChangeTaskStatusResult,
  ChangeTaskStatusUseCase,
} from "./ChangeTaskStatusUseCase";

export { createCompleteTaskUseCase } from "./CompleteTaskUseCase";
export type {
  CompleteTaskParams,
  CompleteTaskResult,
  CompleteTaskUseCase,
} from "./CompleteTaskUseCase";

// Task Assignment
export { createAssignTaskUseCase } from "./AssignTaskUseCase";
export type {
  AssignTaskParams,
  AssignTaskResult,
  AssignTaskUseCase,
} from "./AssignTaskUseCase";

// Task Comments
export { createAddTaskCommentUseCase } from "./AddTaskCommentUseCase";
export type {
  AddTaskCommentParams,
  AddTaskCommentResult,
  AddTaskCommentUseCase,
} from "./AddTaskCommentUseCase";

// Helpers
export * from "./helpers";


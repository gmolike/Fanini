// apps/api/src/infrastructure/di/slices/taskSlice.ts
import type { Container } from "../container";
import {
  createCreateTaskUseCase,
  createUpdateTaskUseCase,
  createDeleteTaskUseCase,
  createGetTaskByIdUseCase,
  createGetTasksUseCase,
  createGetTasksByPersonUseCase,
  createGetTasksByTeamUseCase,
  createGetTasksByEventUseCase,
  createChangeTaskStatusUseCase,
  createAssignTaskUseCase,
  createAddTaskCommentUseCase,
  createCompleteTaskUseCase,
} from "@/application/use-cases/task";
import { MySQLTaskRepository } from "@/infrastructure/repositories/MySQLTaskRepository";
import { createTaskController } from "@/presentation/controllers/task/TaskController";
import { createTaskPermissionService } from "@/application/services/TaskPermissionService";

/**
 * Registriert alle Task-bezogenen Dependencies
 */
export const registerTaskSlice = (container: Container): void => {
  // Repository
  container.register("TaskRepository", () => {
    const db = container.get("Database");
    return new MySQLTaskRepository(db);
  });

  // Services
  container.register("TaskPermissionService", () => {
    return createTaskPermissionService();
  });

  // Use Cases
  registerTaskUseCases(container);

  // Controller
  container.register("TaskController", () => {
    return createTaskController(
      container.get("CreateTaskUseCase"),
      container.get("UpdateTaskUseCase"),
      container.get("GetTaskByIdUseCase"),
      container.get("GetTasksUseCase"),
      container.get("ChangeTaskStatusUseCase"),
    );
  });
};

/**
 * Registriert alle Task Use Cases
 */
const registerTaskUseCases = (container: Container): void => {
  // CRUD Use Cases
  container.register("CreateTaskUseCase", () => {
    return createCreateTaskUseCase(
      container.get("TaskRepository"),
      container.get("MemberRepository"),
      container.get("AuditLogService"),
    );
  });

  container.register("UpdateTaskUseCase", () => {
    return createUpdateTaskUseCase(
      container.get("TaskRepository"),
      container.get("MemberRepository"),
      container.get("TaskPermissionService"),
      container.get("AuditLogService"),
    );
  });

  container.register("DeleteTaskUseCase", () => {
    return createDeleteTaskUseCase(
      container.get("TaskRepository"),
      container.get("TaskPermissionService"),
      container.get("AuditLogService"),
    );
  });

  container.register("GetTaskByIdUseCase", () => {
    return createGetTaskByIdUseCase(
      container.get("TaskRepository"),
      container.get("MemberRepository"),
      container.get("TaskPermissionService"),
    );
  });

  container.register("GetTasksUseCase", () => {
    return createGetTasksUseCase(
      container.get("TaskRepository"),
      container.get("MemberRepository"),
      container.get("TaskPermissionService"),
    );
  });

  // Context-specific Use Cases
  container.register("GetTasksByPersonUseCase", () => {
    return createGetTasksByPersonUseCase(
      container.get("TaskRepository"),
      container.get("MemberRepository"),
      container.get("TaskPermissionService"),
    );
  });

  container.register("GetTasksByTeamUseCase", () => {
    return createGetTasksByTeamUseCase(
      container.get("TaskRepository"),
      container.get("MemberRepository"),
      container.get("TaskPermissionService"),
    );
  });

  container.register("GetTasksByEventUseCase", () => {
    return createGetTasksByEventUseCase(
      container.get("TaskRepository"),
      container.get("EventRepository"),
      container.get("MemberRepository"),
      container.get("TaskPermissionService"),
    );
  });

  // Workflow Use Cases
  container.register("ChangeTaskStatusUseCase", () => {
    return createChangeTaskStatusUseCase(
      container.get("TaskRepository"),
      container.get("TaskPermissionService"),
      container.get("AuditLogService"),
    );
  });

  container.register("CompleteTaskUseCase", () => {
    return createCompleteTaskUseCase(
      container.get("TaskRepository"),
      container.get("TaskPermissionService"),
      container.get("AuditLogService"),
    );
  });

  // Assignment Use Cases
  container.register("AssignTaskUseCase", () => {
    return createAssignTaskUseCase(
      container.get("TaskRepository"),
      container.get("MemberRepository"),
      container.get("TaskPermissionService"),
      container.get("AuditLogService"),
    );
  });

  container.register("AddTaskCommentUseCase", () => {
    return createAddTaskCommentUseCase(
      container.get("TaskRepository"),
      container.get("MemberRepository"),
    );
  });
};

// apps/api/src/infrastructure/di/slices/taskSlice.ts
import type { Container } from "../container";
import {
  CreateTaskUseCase,
  UpdateTaskUseCase,
  DeleteTaskUseCase,
  GetTaskByIdUseCase,
  GetTasksUseCase,
  ChangeTaskStatusUseCase,
  AssignTaskUseCase,
  AddTaskCommentUseCase,
  GetTasksByEventUseCase,
  GetMyTasksUseCase,
  BlockTaskUseCase,
  CompleteTaskUseCase,
  CreateTaskFromTemplateUseCase,
  GetTaskCommentsUseCase,
  GetTasksByMemberUseCase,
  GetTasksByTeamUseCase,
  NotifyTaskAssigneesUseCase,
  UnassignMemberUseCase,
} from "@/application/use-cases/task";
import { MySQLTaskRepository } from "@/infrastructure/repositories/MySQLTaskRepository";
import { createTaskController } from "@/presentation/controllers/task/TaskController";

export const registerTaskSlice = (container: Container): void => {
  // Repository
  container.register("TaskRepository", () => {
    const db = container.get("Database");
    return new MySQLTaskRepository(db);
  });

  // Use Cases
  container.register("CreateTaskUseCase", () => {
    const taskRepo = container.get("TaskRepository");
    const memberRepo = container.get("MemberRepository");
    const permissionService = container.get("PermissionService");
    return new CreateTaskUseCase(taskRepo, memberRepo, permissionService);
  });

  container.register("UpdateTaskUseCase", () => {
    const taskRepo = container.get("TaskRepository");
    const memberRepo = container.get("MemberRepository");
    const permissionService = container.get("PermissionService");
    return new UpdateTaskUseCase(taskRepo, memberRepo, permissionService);
  });

  container.register("DeleteTaskUseCase", () => {
    const taskRepo = container.get("TaskRepository");
    const permissionService = container.get("PermissionService");
    return new DeleteTaskUseCase(taskRepo, permissionService);
  });

  container.register("GetTaskByIdUseCase", () => {
    const taskRepo = container.get("TaskRepository");
    const memberRepo = container.get("MemberRepository");
    const permissionService = container.get("PermissionService");
    return new GetTaskByIdUseCase(taskRepo, memberRepo, permissionService);
  });

  container.register("GetTasksUseCase", () => {
    const taskRepo = container.get("TaskRepository");
    const permissionService = container.get("PermissionService");
    return new GetTasksUseCase(taskRepo, permissionService);
  });

  container.register("ChangeTaskStatusUseCase", () => {
    const taskRepo = container.get("TaskRepository");
    const permissionService = container.get("PermissionService");
    return new ChangeTaskStatusUseCase(taskRepo, permissionService);
  });

  container.register("AssignTaskUseCase", () => {
    const taskRepo = container.get("TaskRepository");
    const memberRepo = container.get("MemberRepository");
    const permissionService = container.get("PermissionService");
    return new AssignTaskUseCase(taskRepo, memberRepo, permissionService);
  });

  container.register("AddTaskCommentUseCase", () => {
    const taskRepo = container.get("TaskRepository");
    const memberRepo = container.get("MemberRepository");
    return new AddTaskCommentUseCase(taskRepo, memberRepo);
  });

  container.register("GetTasksByEventUseCase", () => {
    const taskRepo = container.get("TaskRepository");
    return new GetTasksByEventUseCase(taskRepo);
  });

  container.register("GetMyTasksUseCase", () => {
    const taskRepo = container.get("TaskRepository");
    return new GetMyTasksUseCase(taskRepo);
  });

  // Weitere Use Cases
  container.register("UnassignMemberUseCase", () => {
    const taskRepo = container.get("TaskRepository");
    const permissionService = container.get("PermissionService");
    return new UnassignMemberUseCase(taskRepo, permissionService);
  });

  container.register("GetTasksByMemberUseCase", () => {
    const taskRepo = container.get("TaskRepository");
    return new GetTasksByMemberUseCase(taskRepo);
  });

  container.register("CompleteTaskUseCase", () => {
    const taskRepo = container.get("TaskRepository");
    const permissionService = container.get("PermissionService");
    return new CompleteTaskUseCase(taskRepo, permissionService);
  });

  container.register("BlockTaskUseCase", () => {
    const taskRepo = container.get("TaskRepository");
    const permissionService = container.get("PermissionService");
    return new BlockTaskUseCase(taskRepo, permissionService);
  });

  container.register("GetTasksByTeamUseCase", () => {
    const taskRepo = container.get("TaskRepository");
    return new GetTasksByTeamUseCase(taskRepo);
  });

  container.register("CreateTaskFromTemplateUseCase", () => {
    const taskRepo = container.get("TaskRepository");
    const permissionService = container.get("PermissionService");
    return new CreateTaskFromTemplateUseCase(taskRepo, permissionService);
  });

  container.register("GetTaskCommentsUseCase", () => {
    const taskRepo = container.get("TaskRepository");
    const permissionService = container.get("PermissionService");
    return new GetTaskCommentsUseCase(taskRepo, permissionService);
  });

  container.register("NotifyTaskAssigneesUseCase", () => {
    const taskRepo = container.get("TaskRepository");
    return new NotifyTaskAssigneesUseCase(taskRepo);
  });

  // Controller - mit Factory Function
  container.register("TaskController", () => {
    const createTask = container.get("CreateTaskUseCase");
    const updateTask = container.get("UpdateTaskUseCase");
    const deleteTask = container.get("DeleteTaskUseCase");
    const getTaskById = container.get("GetTaskByIdUseCase");
    const getTasks = container.get("GetTasksUseCase");
    const changeStatus = container.get("ChangeTaskStatusUseCase");
    const assignTask = container.get("AssignTaskUseCase");
    const addComment = container.get("AddTaskCommentUseCase");
    const getTasksByEvent = container.get("GetTasksByEventUseCase");
    const getMyTasks = container.get("GetMyTasksUseCase");

    return createTaskController(
      createTask,
      updateTask,
      deleteTask,
      getTaskById,
      getTasks,
      changeStatus,
      assignTask,
      addComment,
      getTasksByEvent,
      getMyTasks,
    );
  });
};

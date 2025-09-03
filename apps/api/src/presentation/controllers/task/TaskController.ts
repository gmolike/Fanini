// apps/api/src/presentation/controllers/task/TaskController.ts
import type {
  CreateTaskUseCase,
  UpdateTaskUseCase,
  GetTaskByIdUseCase,
  GetTasksUseCase,
  ChangeTaskStatusUseCase,
} from "@/application/use-cases/task";
import {
  success,
  created,
  notFound,
  error,
} from "@/presentation/helpers/responses";
import {
  validateCreateTask,
  validateUpdateTask,
  validateStatusChange,
} from "./validators";

/**
 * Task Controller
 */
export type TaskController = {
  createTask: (req: Request) => Promise<Response>;
  updateTask: (req: Request) => Promise<Response>;
  getTaskById: (req: Request) => Promise<Response>;
  getTasks: (req: Request) => Promise<Response>;
  changeTaskStatus: (req: Request) => Promise<Response>;
};

/**
 * Factory für TaskController
 */
export const createTaskController = (
  createTaskUseCase: CreateTaskUseCase,
  updateTaskUseCase: UpdateTaskUseCase,
  getTaskByIdUseCase: GetTaskByIdUseCase,
  getTasksUseCase: GetTasksUseCase,
  changeTaskStatusUseCase: ChangeTaskStatusUseCase,
): TaskController => ({
  createTask: async (req: Request) => {
    try {
      const body = await req.json();
      const validation = validateCreateTask(body);

      if (!validation.isValid) {
        return error(validation.error ?? "", "VALIDATION_ERROR", 400);
      }

      const { userId, userRole, userName } = req as any;

      const result = await createTaskUseCase.execute({
        data: validation.data,
        userId,
        userRole,
        userName,
      });

      if (!result.success) {
        return error(
          result.error || "Task konnte nicht erstellt werden",
          "BUSINESS_RULE_VIOLATION",
          400,
        );
      }

      return created(result.task, `/api/internal/tasks/${result.task!.id}`);
    } catch (err) {
      console.error("Create task error:", err);
      return error("Interner Fehler", "INTERNAL_ERROR", 500);
    }
  },

  updateTask: async (req: Request) => {
    try {
      const { params } = req as any;
      const body = await req.json();
      const validation = validateUpdateTask(body);

      if (!validation.isValid) {
        return error(validation.error ?? "", "VALIDATION_ERROR", 400);
      }

      const { userId, userRole } = req as any;

      const result = await updateTaskUseCase.execute({
        taskId: params.id,
        data: validation.data,
        userId,
        userRole,
      });

      if (!result.success) {
        return error(
          result.error || "Task konnte nicht aktualisiert werden",
          "BUSINESS_RULE_VIOLATION",
          400,
        );
      }

      return success(result.task);
    } catch (err) {
      console.error("Update task error:", err);
      return error("Interner Fehler", "INTERNAL_ERROR", 500);
    }
  },

  getTaskById: async (req: Request) => {
    try {
      const { params } = req as any;
      const { userId, userRole } = req as any;

      const result = await getTaskByIdUseCase.execute({
        taskId: params.id,
        userId,
        userRole,
      });

      if (!result?.task) {
        return notFound("Task", params.id);
      }

      return success(result.task);
    } catch (err) {
      console.error("Get task error:", err);
      return error("Interner Fehler", "INTERNAL_ERROR", 500);
    }
  },

  getTasks: async (req: Request) => {
    try {
      const url = new URL(req.url);
      const { userId, userRole } = req as any;

      // Query-Parameter parsen
      const filters = {
        contextType: url.searchParams.get("contextType") as any,
        contextId: url.searchParams.get("contextId") || undefined,
        status: url.searchParams.getAll("status") as any,
        prioritaet: url.searchParams.getAll("prioritaet") as any,
        kategorie: url.searchParams.get("kategorie") || undefined,
      };

      const result = await getTasksUseCase.execute({
        filters,
        userId,
        userRole,
      });

      return success({
        items: result.tasks,
        total: result.tasks.length,
      });
    } catch (err) {
      console.error("Get tasks error:", err);
      return error("Interner Fehler", "INTERNAL_ERROR", 500);
    }
  },

  changeTaskStatus: async (req: Request) => {
    try {
      const { params } = req as any;
      const body = await req.json();
      const validation = validateStatusChange(body);

      if (!validation.isValid) {
        return error(validation.error ?? "", "VALIDATION_ERROR", 400);
      }

      const { userId, userRole } = req as any;

      const result = await changeTaskStatusUseCase.execute({
        taskId: params.id,
        data: validation.data,
        userId,
        userRole,
      });

      if (!result.success) {
        return error(
          result.error || "Status konnte nicht geändert werden",
          "BUSINESS_RULE_VIOLATION",
          400,
        );
      }

      return success(result.task);
    } catch (err) {
      console.error("Change status error:", err);
      return error("Interner Fehler", "INTERNAL_ERROR", 500);
    }
  },
});

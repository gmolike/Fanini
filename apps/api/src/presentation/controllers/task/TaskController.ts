// apps/api/src/presentation/controllers/task/TaskController.ts
import { z } from "zod";
import type {
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
} from "@/application/use-cases/task";
import { TaskStatus } from "@/domain/entities/Task";
import {
  success,
  error,
  notFound,
  created,
} from "@/presentation/helpers/responses";
import { withErrorHandling } from "@/presentation/helpers/responses/errorHandler";

// Validation Schemas
const createTaskSchema = z.object({
  titel: z.string().min(3).max(255),
  beschreibung: z.string().optional(),
  context_type: z.enum(["event", "team", "general"]),
  context_id: z.string().optional(),
  verantwortlich_id: z.string().optional(),
  prioritaet: z.enum(["niedrig", "mittel", "hoch", "kritisch"]).optional(),
  frist: z.string().optional(),
  materialien: z
    .array(
      z.object({
        name: z.string(),
        menge: z.number(),
        einheit: z.string(),
        beschreibung: z.string().optional(),
      }),
    )
    .optional(),
  abhaengig_von: z.array(z.string()).optional(),
  kategorie: z.string().optional(),
});

const updateTaskSchema = createTaskSchema.partial().extend({
  materialien: z
    .array(
      z.object({
        name: z.string(),
        menge: z.number(),
        einheit: z.string(),
        beschreibung: z.string().optional(),
        besorgt: z.boolean(),
      }),
    )
    .optional(),
});

const changeStatusSchema = z.object({
  status: z.enum([
    "offen",
    "in_bearbeitung",
    "review",
    "erledigt",
    "blockiert",
  ]),
  kommentar: z.string().optional(),
});

const assignTaskSchema = z.object({
  memberIds: z.array(z.string()),
  kommentar: z.string().optional(),
});

const addCommentSchema = z.object({
  text: z.string().min(1),
  erwaehntePersonen: z.array(z.string()).optional(),
});

export type TaskController = {
  createTask: (req: Request) => Promise<Response>;
  updateTask: (req: Request) => Promise<Response>;
  deleteTask: (req: Request) => Promise<Response>;
  getTaskById: (req: Request) => Promise<Response>;
  getTasks: (req: Request) => Promise<Response>;
  changeTaskStatus: (req: Request) => Promise<Response>;
  assignTask: (req: Request) => Promise<Response>;
  unassignMember: (req: Request) => Promise<Response>;
  addComment: (req: Request) => Promise<Response>;
  getComments: (req: Request) => Promise<Response>;
  getMyTasks: (req: Request) => Promise<Response>;
  getTasksByMember: (req: Request) => Promise<Response>;
  getTasksByEvent: (req: Request) => Promise<Response>;
  getTasksByTeam: (req: Request) => Promise<Response>;
  completeTask: (req: Request) => Promise<Response>;
  blockTask: (req: Request) => Promise<Response>;
  createFromTemplate: (req: Request) => Promise<Response>;
  getTemplates: (req: Request) => Promise<Response>;
};

export const createTaskController = (
  createTaskUseCase: CreateTaskUseCase,
  updateTaskUseCase: UpdateTaskUseCase,
  deleteTaskUseCase: DeleteTaskUseCase,
  getTaskByIdUseCase: GetTaskByIdUseCase,
  getTasksUseCase: GetTasksUseCase,
  changeTaskStatusUseCase: ChangeTaskStatusUseCase,
  assignTaskUseCase: AssignTaskUseCase,
  addTaskCommentUseCase: AddTaskCommentUseCase,
  getTasksByEventUseCase: GetTasksByEventUseCase,
  getMyTasksUseCase: GetMyTasksUseCase,
): TaskController => ({
  /**
   * Create task
   */
  createTask: withErrorHandling(async (req: Request) => {
    const body = await req.json();
    const validated = createTaskSchema.parse(body);
    const { userId, userRole } = req as any;

    const task = await createTaskUseCase.execute({
      ...validated,
      userId,
      userRole,
      ipAddress: req.headers.get("x-forwarded-for") || undefined,
      userAgent: req.headers.get("user-agent") || undefined,
    });

    return created(task, `/api/internal/tasks/${task.id}`);
  }),

  /**
   * Update task
   */
  updateTask: withErrorHandling(async (req: Request) => {
    const { params } = req as any;
    const body = await req.json();
    const validated = updateTaskSchema.parse(body);
    const { userId, userRole } = req as any;

    const task = await updateTaskUseCase.execute({
      id: params.id,
      data: validated,
      userId,
      userRole,
    });

    return success(task);
  }),

  /**
   * Delete task
   */
  deleteTask: withErrorHandling(async (req: Request) => {
    const { params } = req as any;
    const { userId, userRole } = req as any;

    await deleteTaskUseCase.execute({
      id: params.id,
      userId,
      userRole,
    });

    return success({
      message: "Task erfolgreich gelöscht",
    });
  }),

  /**
   * Get task by ID
   */
  getTaskById: withErrorHandling(async (req: Request) => {
    const { params } = req as any;
    const { userId, userRole } = req as any;

    const task = await getTaskByIdUseCase.execute({
      id: params.id,
      userId,
      userRole,
    });

    if (!task) {
      return notFound("Task", params.id);
    }

    return success(task);
  }),

  /**
   * Get tasks
   */
  getTasks: withErrorHandling(async (req: Request) => {
    const url = new URL(req.url);
    const { userId, userRole } = req as any;

    const statusParam = url.searchParams.getAll("status");
    let status: TaskStatus[] | undefined;
    if (statusParam.length > 0) {
      status = statusParam as TaskStatus[];
    }

    const filters = {
      contextType: url.searchParams.get("contextType") as
        | "event"
        | "team"
        | "general"
        | undefined,
      contextId: url.searchParams.get("contextId") || undefined,
      status,
      prioritaet: url.searchParams.getAll("prioritaet") as any,
      nurMeine: url.searchParams.get("nurMeine") === "true",
      verantwortlichId: url.searchParams.get("verantwortlichId") || undefined,
    };

    const tasks = await getTasksUseCase.execute({
      filters,
      userId,
      userRole,
    });

    return success({
      data: tasks,
      count: tasks.length,
    });
  }),

  /**
   * Change task status
   */
  changeTaskStatus: withErrorHandling(async (req: Request) => {
    const { params } = req as any;
    const body = await req.json();
    const validated = changeStatusSchema.parse(body);
    const { userId, userRole } = req as any;

    const task = await changeTaskStatusUseCase.execute({
      id: params.id,
      ...validated,
      userId,
      userRole,
    });

    return success(task);
  }),

  /**
   * Assign task
   */
  assignTask: withErrorHandling(async (req: Request) => {
    const { params } = req as any;
    const body = await req.json();
    const validated = assignTaskSchema.parse(body);
    const { userId, userRole } = req as any;

    await assignTaskUseCase.execute({
      taskId: params.id,
      ...validated,
      userId,
      userRole,
    });

    return success({
      message: "Mitglieder erfolgreich zugewiesen",
    });
  }),

  /**
   * Unassign member
   */
  unassignMember: withErrorHandling(async (req: Request) => {
    const { params } = req as any;
    const { userId, userRole } = req as any;

    const task = await getTaskByIdUseCase.execute({
      id: params.id,
      userId,
      userRole,
    });

    if (!task) {
      return notFound("Task", params.id);
    }

    await assignTaskUseCase.execute({
      taskId: params.id,
      memberIds: task.zugewiesenAn.filter((id) => id !== params.memberId),
      kommentar: `Mitglied entfernt`,
      userId,
      userRole,
    });

    return success({
      message: "Mitglied erfolgreich entfernt",
    });
  }),

  /**
   * Add comment
   */
  addComment: withErrorHandling(async (req: Request) => {
    const { params } = req as any;
    const body = await req.json();
    const validated = addCommentSchema.parse(body);
    const { userId, userRole } = req as any;

    const comment = await addTaskCommentUseCase.execute({
      taskId: params.id,
      ...validated,
      userId,
      userRole,
    });

    return created(comment);
  }),

  /**
   * Get comments
   */
  getComments: withErrorHandling(async (req: Request) => {
    const { params } = req as any;
    const { userId, userRole } = req as any;

    const task = await getTaskByIdUseCase.execute({
      id: params.id,
      userId,
      userRole,
    });

    if (!task) {
      return notFound("Task", params.id);
    }

    return success({
      data: task.kommentare,
      count: task.kommentare.length,
    });
  }),

  /**
   * Get my tasks
   */
  getMyTasks: withErrorHandling(async (req: Request) => {
    const { userId, userRole } = req as any;

    const tasks = await getMyTasksUseCase.execute({
      userId,
      userRole,
    });

    return success({
      data: tasks,
      count: tasks.length,
    });
  }),

  /**
   * Get tasks by member
   */
  getTasksByMember: withErrorHandling(async (req: Request) => {
    const { params } = req as any;
    const { userId, userRole } = req as any;

    if (
      !["ADMIN", "VORSTAND", "BEIRAT"].includes(userRole) &&
      params.memberId !== userId
    ) {
      return error("Keine Berechtigung", "FORBIDDEN", 403);
    }

    const tasks = await getTasksUseCase.execute({
      filters: {
        zugewiesenAn: params.memberId,
        nurAktive: true,
      },
      userId,
      userRole,
    });

    return success({
      data: tasks,
      count: tasks.length,
    });
  }),

  /**
   * Get tasks by event
   */
  getTasksByEvent: withErrorHandling(async (req: Request) => {
    const { params } = req as any;
    const { userId, userRole } = req as any;

    const tasks = await getTasksByEventUseCase.execute({
      eventId: params.eventId,
      userId,
      userRole,
    });

    return success({
      data: tasks,
      count: tasks.length,
    });
  }),

  /**
   * Get tasks by team
   */
  getTasksByTeam: withErrorHandling(async (req: Request) => {
    const { params } = req as any;
    const { userId, userRole } = req as any;

    const tasks = await getTasksUseCase.execute({
      filters: {
        contextType: "team",
        contextId: params.teamId,
      },
      userId,
      userRole,
    });

    return success({
      data: tasks,
      count: tasks.length,
    });
  }),

  /**
   * Complete task
   */
  completeTask: withErrorHandling(async (req: Request) => {
    const { params } = req as any;
    const body = (await req.json()) as { kommentar?: string };
    const { userId, userRole } = req as any;

    const task = await changeTaskStatusUseCase.execute({
      id: params.id,
      status: "erledigt",
      kommentar: body.kommentar,
      userId,
      userRole,
    });

    return success(task);
  }),

  /**
   * Block task
   */
  blockTask: withErrorHandling(async (req: Request) => {
    const { params } = req as any;
    const body = (await req.json()) as { grund: string };
    const { userId, userRole } = req as any;

    if (!body.grund) {
      return error("Blockierungsgrund erforderlich", "VALIDATION_ERROR", 400);
    }

    const task = await changeTaskStatusUseCase.execute({
      id: params.id,
      status: "blockiert",
      kommentar: `Blockiert: ${body.grund}`,
      userId,
      userRole,
    });

    return success(task);
  }),

  /**
   * Create from template
   */
  createFromTemplate: withErrorHandling(async (req: Request) => {
    const body = (await req.json()) as {
      templateId: string;
      context_type: "event" | "team" | "general";
      context_id: string;
      anpassungen?: {
        titel?: string;
        frist?: string;
        verantwortlich_id?: string;
      };
    };
    const { userId, userRole } = req as any;

    const template = await getTaskByIdUseCase.execute({
      id: body.templateId,
      userId,
      userRole,
    });

    if (!template || !template.istStandardaufgabe) {
      return notFound("Vorlage", body.templateId);
    }

    const newTaskData = {
      titel: body.anpassungen?.titel || template.titel,
      beschreibung: template.beschreibung,
      context_type: body.context_type,
      context_id: body.context_id,
      verantwortlich_id:
        body.anpassungen?.verantwortlich_id || template.verantwortlichId,
      prioritaet: template.prioritaet,
      frist: body.anpassungen?.frist,
      materialien: template.materialien.map((m) => ({
        name: m.name,
        menge: m.menge,
        einheit: m.einheit,
        beschreibung: m.beschreibung,
      })),
      kategorie: template.kategorie,
      userId,
      userRole,
    };

    const task = await createTaskUseCase.execute(newTaskData);

    return created(task, `/api/internal/tasks/${task.id}`);
  }),

  /**
   * Get templates
   */
  getTemplates: withErrorHandling(async (req: Request) => {
    const url = new URL(req.url);
    const { userId, userRole } = req as any;

    const kategorie = url.searchParams.get("kategorie");

    const templates = await getTasksUseCase.execute({
      filters: {
        nurAktive: true,
        ...(kategorie && { kategorie }),
      },
      userId,
      userRole,
    });

    const filteredTemplates = templates.filter((t) => t.istStandardaufgabe);

    return success({
      data: filteredTemplates,
      count: filteredTemplates.length,
    });
  }),
});

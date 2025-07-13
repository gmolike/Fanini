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

export class TaskController {
  constructor(
    private readonly createTaskUseCase: CreateTaskUseCase,
    private readonly updateTaskUseCase: UpdateTaskUseCase,
    private readonly deleteTaskUseCase: DeleteTaskUseCase,
    private readonly getTaskByIdUseCase: GetTaskByIdUseCase,
    private readonly getTasksUseCase: GetTasksUseCase,
    private readonly changeTaskStatusUseCase: ChangeTaskStatusUseCase,
    private readonly assignTaskUseCase: AssignTaskUseCase,
    private readonly addTaskCommentUseCase: AddTaskCommentUseCase,
    private readonly getTasksByEventUseCase: GetTasksByEventUseCase,
    private readonly getMyTasksUseCase: GetMyTasksUseCase,
  ) {}

  /**
   * @swagger
   * /api/internal/tasks:
   *   post:
   *     summary: Task erstellen
   *     tags: ["📋 Tasks"]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CreateTask'
   *     responses:
   *       201:
   *         description: Task erfolgreich erstellt
   *       400:
   *         description: Validierungsfehler
   *       403:
   *         description: Keine Berechtigung
   */
  async createTask(req: Request): Promise<Response> {
    try {
      const body = await req.json();
      const validated = createTaskSchema.parse(body);
      const { userId, userRole } = req as any;

      const task = await this.createTaskUseCase.execute({
        ...validated,
        userId,
        userRole,
        ipAddress: req.headers.get("x-forwarded-for") || undefined,
        userAgent: req.headers.get("user-agent") || undefined,
      });

      return Response.json({ success: true, data: task }, { status: 201 });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return Response.json(
          { success: false, errors: error.errors },
          { status: 400 },
        );
      }
      if (error instanceof Error) {
        return Response.json(
          { success: false, error: error.message },
          { status: error.message.includes("Berechtigung") ? 403 : 400 },
        );
      }
      return Response.json(
        { success: false, error: "Task creation failed" },
        { status: 500 },
      );
    }
  }

  /**
   * @swagger
   * /api/internal/tasks/{id}:
   *   put:
   *     summary: Task aktualisieren
   *     tags: ["📋 Tasks"]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/UpdateTask'
   *     responses:
   *       200:
   *         description: Task erfolgreich aktualisiert
   *       403:
   *         description: Keine Berechtigung
   *       404:
   *         description: Task nicht gefunden
   */
  async updateTask(req: Request): Promise<Response> {
    try {
      const { params } = req as any;
      const body = await req.json();
      const validated = updateTaskSchema.parse(body);
      const { userId, userRole } = req as any;

      const task = await this.updateTaskUseCase.execute({
        id: params.id,
        data: validated,
        userId,
        userRole,
      });

      return Response.json({ success: true, data: task });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return Response.json(
          { success: false, errors: error.errors },
          { status: 400 },
        );
      }
      if (error instanceof Error) {
        const status = error.message.includes("nicht gefunden")
          ? 404
          : error.message.includes("Berechtigung")
            ? 403
            : 400;
        return Response.json(
          { success: false, error: error.message },
          { status },
        );
      }
      return Response.json(
        { success: false, error: "Task update failed" },
        { status: 500 },
      );
    }
  }

  /**
   * @swagger
   * /api/internal/tasks/{id}:
   *   delete:
   *     summary: Task löschen
   *     tags: ["📋 Tasks"]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Task erfolgreich gelöscht
   *       403:
   *         description: Keine Berechtigung
   *       404:
   *         description: Task nicht gefunden
   */
  async deleteTask(req: Request): Promise<Response> {
    try {
      const { params } = req as any;
      const { userId, userRole } = req as any;

      await this.deleteTaskUseCase.execute({
        id: params.id,
        userId,
        userRole,
      });

      return Response.json({
        success: true,
        message: "Task erfolgreich gelöscht",
      });
    } catch (error) {
      if (error instanceof Error) {
        const status = error.message.includes("nicht gefunden")
          ? 404
          : error.message.includes("Berechtigung")
            ? 403
            : 400;
        return Response.json(
          { success: false, error: error.message },
          { status },
        );
      }
      return Response.json(
        { success: false, error: "Task deletion failed" },
        { status: 500 },
      );
    }
  }

  /**
   * @swagger
   * /api/internal/tasks/{id}:
   *   get:
   *     summary: Task-Details abrufen
   *     tags: ["📋 Tasks"]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Task mit allen Details
   *       403:
   *         description: Keine Berechtigung
   *       404:
   *         description: Task nicht gefunden
   */
  async getTaskById(req: Request): Promise<Response> {
    try {
      const { params } = req as any;
      const { userId, userRole } = req as any;

      const task = await this.getTaskByIdUseCase.execute({
        id: params.id,
        userId,
        userRole,
      });

      if (!task) {
        return Response.json(
          { success: false, error: "Task nicht gefunden" },
          { status: 404 },
        );
      }

      return Response.json({ success: true, data: task });
    } catch (error) {
      if (error instanceof Error && error.message.includes("Berechtigung")) {
        return Response.json(
          { success: false, error: error.message },
          { status: 403 },
        );
      }
      return Response.json(
        { success: false, error: "Failed to fetch task" },
        { status: 500 },
      );
    }
  }

  /**
   * @swagger
   * /api/internal/tasks:
   *   get:
   *     summary: Task-Liste abrufen
   *     tags: ["📋 Tasks"]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: contextType
   *         schema:
   *           type: string
   *           enum: [event, team, general]
   *       - in: query
   *         name: contextId
   *         schema:
   *           type: string
   *       - in: query
   *         name: status
   *         schema:
   *           type: array
   *           items:
   *             type: string
   *       - in: query
   *         name: prioritaet
   *         schema:
   *           type: array
   *           items:
   *             type: string
   *       - in: query
   *         name: nurMeine
   *         schema:
   *           type: boolean
   *     responses:
   *       200:
   *         description: Task-Liste
   */
  async getTasks(req: Request): Promise<Response> {
    try {
      const url = new URL(req.url);
      const { userId, userRole } = req as any;

      // Status-Parameter parsen
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

      const tasks = await this.getTasksUseCase.execute({
        filters,
        userId,
        userRole,
      });

      return Response.json({
        success: true,
        data: tasks,
        count: tasks.length,
      });
    } catch (error) {
      console.error("Error fetching tasks:", error);
      return Response.json(
        { success: false, error: "Failed to fetch tasks" },
        { status: 500 },
      );
    }
  }

  /**
   * @swagger
   * /api/internal/tasks/{id}/status:
   *   patch:
   *     summary: Task-Status ändern
   *     tags: ["📋 Tasks"]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - status
   *             properties:
   *               status:
   *                 type: string
   *                 enum: [offen, in_bearbeitung, review, erledigt, blockiert]
   *               kommentar:
   *                 type: string
   *     responses:
   *       200:
   *         description: Status erfolgreich geändert
   *       403:
   *         description: Keine Berechtigung
   */
  async changeTaskStatus(req: Request): Promise<Response> {
    try {
      const { params } = req as any;
      const body = await req.json();
      const validated = changeStatusSchema.parse(body);
      const { userId, userRole } = req as any;

      const task = await this.changeTaskStatusUseCase.execute({
        id: params.id,
        ...validated,
        userId,
        userRole,
      });

      return Response.json({ success: true, data: task });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return Response.json(
          { success: false, errors: error.errors },
          { status: 400 },
        );
      }
      if (error instanceof Error) {
        const status = error.message.includes("nicht gefunden")
          ? 404
          : error.message.includes("Berechtigung")
            ? 403
            : 400;
        return Response.json(
          { success: false, error: error.message },
          { status },
        );
      }
      return Response.json(
        { success: false, error: "Status change failed" },
        { status: 500 },
      );
    }
  }

  /**
   * @swagger
   * /api/internal/tasks/{id}/assign:
   *   patch:
   *     summary: Mitglieder zuweisen
   *     tags: ["📋 Tasks"]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - memberIds
   *             properties:
   *               memberIds:
   *                 type: array
   *                 items:
   *                   type: string
   *               kommentar:
   *                 type: string
   *     responses:
   *       200:
   *         description: Mitglieder erfolgreich zugewiesen
   *       403:
   *         description: Keine Berechtigung
   */
  async assignTask(req: Request): Promise<Response> {
    try {
      const { params } = req as any;
      const body = await req.json();
      const validated = assignTaskSchema.parse(body);
      const { userId, userRole } = req as any;

      await this.assignTaskUseCase.execute({
        taskId: params.id,
        ...validated,
        userId,
        userRole,
      });

      return Response.json({
        success: true,
        message: "Mitglieder erfolgreich zugewiesen",
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return Response.json(
          { success: false, errors: error.errors },
          { status: 400 },
        );
      }
      if (error instanceof Error) {
        const status = error.message.includes("nicht gefunden")
          ? 404
          : error.message.includes("Berechtigung")
            ? 403
            : 400;
        return Response.json(
          { success: false, error: error.message },
          { status },
        );
      }
      return Response.json(
        { success: false, error: "Assignment failed" },
        { status: 500 },
      );
    }
  }

  /**
   * @swagger
   * /api/internal/tasks/{id}/assign/{memberId}:
   *   delete:
   *     summary: Mitglied von Task entfernen
   *     tags: ["📋 Tasks"]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *       - in: path
   *         name: memberId
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Mitglied erfolgreich entfernt
   *       403:
   *         description: Keine Berechtigung
   */
  async unassignMember(req: Request): Promise<Response> {
    try {
      const { params } = req as any;
      const { userId, userRole } = req as any;

      // Berechtigung prüfen
      const task = await this.getTaskByIdUseCase.execute({
        id: params.id,
        userId,
        userRole,
      });

      if (!task) {
        return Response.json(
          { success: false, error: "Task nicht gefunden" },
          { status: 404 },
        );
      }

      await this.assignTaskUseCase.execute({
        taskId: params.id,
        memberIds: task.zugewiesenAn.filter((id) => id !== params.memberId),
        kommentar: `Mitglied entfernt`,
        userId,
        userRole,
      });

      return Response.json({
        success: true,
        message: "Mitglied erfolgreich entfernt",
      });
    } catch (error) {
      if (error instanceof Error) {
        const status = error.message.includes("Berechtigung") ? 403 : 400;
        return Response.json(
          { success: false, error: error.message },
          { status },
        );
      }
      return Response.json(
        { success: false, error: "Unassignment failed" },
        { status: 500 },
      );
    }
  }

  /**
   * @swagger
   * /api/internal/tasks/{id}/comments:
   *   post:
   *     summary: Kommentar hinzufügen
   *     tags: ["📋 Tasks"]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - text
   *             properties:
   *               text:
   *                 type: string
   *               erwaehntePersonen:
   *                 type: array
   *                 items:
   *                   type: string
   *     responses:
   *       201:
   *         description: Kommentar erfolgreich hinzugefügt
   *       403:
   *         description: Keine Berechtigung
   */
  async addComment(req: Request): Promise<Response> {
    try {
      const { params } = req as any;
      const body = await req.json();
      const validated = addCommentSchema.parse(body);
      const { userId, userRole } = req as any;

      const comment = await this.addTaskCommentUseCase.execute({
        taskId: params.id,
        ...validated,
        userId,
        userRole,
      });

      return Response.json({ success: true, data: comment }, { status: 201 });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return Response.json(
          { success: false, errors: error.errors },
          { status: 400 },
        );
      }
      if (error instanceof Error) {
        const status = error.message.includes("nicht gefunden")
          ? 404
          : error.message.includes("Berechtigung")
            ? 403
            : 400;
        return Response.json(
          { success: false, error: error.message },
          { status },
        );
      }
      return Response.json(
        { success: false, error: "Comment creation failed" },
        { status: 500 },
      );
    }
  }

  /**
   * @swagger
   * /api/internal/tasks/{id}/comments:
   *   get:
   *     summary: Kommentare abrufen
   *     tags: ["📋 Tasks"]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Kommentarliste
   *       403:
   *         description: Keine Berechtigung
   */
  async getComments(req: Request): Promise<Response> {
    try {
      const { params } = req as any;
      const { userId, userRole } = req as any;

      // Zuerst prüfen ob Task angezeigt werden darf
      const task = await this.getTaskByIdUseCase.execute({
        id: params.id,
        userId,
        userRole,
      });

      if (!task) {
        return Response.json(
          { success: false, error: "Task nicht gefunden" },
          { status: 404 },
        );
      }

      return Response.json({
        success: true,
        data: task.kommentare,
        count: task.kommentare.length,
      });
    } catch (error) {
      if (error instanceof Error && error.message.includes("Berechtigung")) {
        return Response.json(
          { success: false, error: error.message },
          { status: 403 },
        );
      }
      return Response.json(
        { success: false, error: "Failed to fetch comments" },
        { status: 500 },
      );
    }
  }

  /**
   * @swagger
   * /api/internal/tasks/my-tasks:
   *   get:
   *     summary: Meine Tasks abrufen
   *     tags: ["📋 Tasks"]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: status
   *         schema:
   *           type: array
   *           items:
   *             type: string
   *       - in: query
   *         name: prioritaet
   *         schema:
   *           type: array
   *           items:
   *             type: string
   *     responses:
   *       200:
   *         description: Persönliche Task-Liste
   */
  async getMyTasks(req: Request): Promise<Response> {
    try {
      const { userId, userRole } = req as any;

      const tasks = await this.getMyTasksUseCase.execute({
        userId,
        userRole,
      });

      return Response.json({
        success: true,
        data: tasks,
        count: tasks.length,
      });
    } catch (error) {
      console.error("Error fetching my tasks:", error);
      return Response.json(
        { success: false, error: "Failed to fetch tasks" },
        { status: 500 },
      );
    }
  }

  /**
   * @swagger
   * /api/internal/tasks/member/{memberId}:
   *   get:
   *     summary: Tasks eines Mitglieds
   *     tags: ["📋 Tasks"]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: memberId
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Task-Liste des Mitglieds
   *       403:
   *         description: Keine Berechtigung
   */
  async getTasksByMember(req: Request): Promise<Response> {
    try {
      const { params } = req as any;
      const { userId, userRole } = req as any;

      // Nur Admin, Vorstand und Beirat dürfen Tasks anderer sehen
      if (
        !["ADMIN", "VORSTAND", "BEIRAT"].includes(userRole) &&
        params.memberId !== userId
      ) {
        return Response.json(
          { success: false, error: "Keine Berechtigung" },
          { status: 403 },
        );
      }

      const tasks = await this.getTasksUseCase.execute({
        filters: {
          zugewiesenAn: params.memberId,
          nurAktive: true,
        },
        userId,
        userRole,
      });

      return Response.json({
        success: true,
        data: tasks,
        count: tasks.length,
      });
    } catch (error) {
      console.error("Error fetching member tasks:", error);
      return Response.json(
        { success: false, error: "Failed to fetch tasks" },
        { status: 500 },
      );
    }
  }

  /**
   * @swagger
   * /api/internal/events/{eventId}/tasks:
   *   get:
   *     summary: Tasks eines Events
   *     tags: ["📋 Tasks"]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: eventId
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Task-Liste des Events
   */
  async getTasksByEvent(req: Request): Promise<Response> {
    try {
      const { params } = req as any;
      const { userId, userRole } = req as any;

      const tasks = await this.getTasksByEventUseCase.execute({
        eventId: params.eventId,
        userId,
        userRole,
      });

      return Response.json({
        success: true,
        data: tasks,
        count: tasks.length,
      });
    } catch (error) {
      console.error("Error fetching event tasks:", error);
      return Response.json(
        { success: false, error: "Failed to fetch tasks" },
        { status: 500 },
      );
    }
  }

  /**
   * @swagger
   * /api/internal/teams/{teamId}/tasks:
   *   get:
   *     summary: Tasks eines Teams
   *     tags: ["📋 Tasks"]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: teamId
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Task-Liste des Teams
   */
  async getTasksByTeam(req: Request): Promise<Response> {
    try {
      const { params } = req as any;
      const { userId, userRole } = req as any;

      const tasks = await this.getTasksUseCase.execute({
        filters: {
          contextType: "team",
          contextId: params.teamId,
        },
        userId,
        userRole,
      });

      return Response.json({
        success: true,
        data: tasks,
        count: tasks.length,
      });
    } catch (error) {
      console.error("Error fetching team tasks:", error);
      return Response.json(
        { success: false, error: "Failed to fetch tasks" },
        { status: 500 },
      );
    }
  }

  /**
   * @swagger
   * /api/internal/tasks/{id}/complete:
   *   post:
   *     summary: Task als erledigt markieren
   *     tags: ["📋 Tasks"]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     requestBody:
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               kommentar:
   *                 type: string
   *     responses:
   *       200:
   *         description: Task erfolgreich erledigt
   *       403:
   *         description: Keine Berechtigung
   */
  async completeTask(req: Request): Promise<Response> {
    try {
      const { params } = req as any;
      const body = (await req.json()) as { kommentar?: string };
      const { userId, userRole } = req as any;

      const task = await this.changeTaskStatusUseCase.execute({
        id: params.id,
        status: "erledigt",
        kommentar: body.kommentar,
        userId,
        userRole,
      });

      return Response.json({ success: true, data: task });
    } catch (error) {
      if (error instanceof Error) {
        const status = error.message.includes("nicht gefunden")
          ? 404
          : error.message.includes("Berechtigung")
            ? 403
            : 400;
        return Response.json(
          { success: false, error: error.message },
          { status },
        );
      }
      return Response.json(
        { success: false, error: "Task completion failed" },
        { status: 500 },
      );
    }
  }

  /**
   * @swagger
   * /api/internal/tasks/{id}/block:
   *   post:
   *     summary: Task blockieren
   *     tags: ["📋 Tasks"]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - grund
   *             properties:
   *               grund:
   *                 type: string
   *     responses:
   *       200:
   *         description: Task erfolgreich blockiert
   *       403:
   *         description: Keine Berechtigung
   */
  async blockTask(req: Request): Promise<Response> {
    try {
      const { params } = req as any;
      const body = (await req.json()) as { grund: string };
      const { userId, userRole } = req as any;

      if (!body.grund) {
        return Response.json(
          { success: false, error: "Blockierungsgrund erforderlich" },
          { status: 400 },
        );
      }

      const task = await this.changeTaskStatusUseCase.execute({
        id: params.id,
        status: "blockiert",
        kommentar: `Blockiert: ${body.grund}`,
        userId,
        userRole,
      });

      return Response.json({ success: true, data: task });
    } catch (error) {
      if (error instanceof Error) {
        const status = error.message.includes("nicht gefunden")
          ? 404
          : error.message.includes("Berechtigung")
            ? 403
            : 400;
        return Response.json(
          { success: false, error: error.message },
          { status },
        );
      }
      return Response.json(
        { success: false, error: "Task blocking failed" },
        { status: 500 },
      );
    }
  }

  /**
   * @swagger
   * /api/internal/tasks/create-from-template:
   *   post:
   *     summary: Task aus Vorlage erstellen
   *     tags: ["📋 Tasks"]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - templateId
   *               - context_type
   *               - context_id
   *             properties:
   *               templateId:
   *                 type: string
   *               context_type:
   *                 type: string
   *                 enum: [event, team, general]
   *               context_id:
   *                 type: string
   *               anpassungen:
   *                 type: object
   *                 properties:
   *                   titel:
   *                     type: string
   *                   frist:
   *                     type: string
   *                   verantwortlich_id:
   *                     type: string
   *     responses:
   *       201:
   *         description: Task aus Vorlage erstellt
   *       404:
   *         description: Vorlage nicht gefunden
   */
  async createFromTemplate(req: Request): Promise<Response> {
    try {
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

      // Template Task laden
      const template = await this.getTaskByIdUseCase.execute({
        id: body.templateId,
        userId,
        userRole,
      });

      if (!template || !template.istStandardaufgabe) {
        return Response.json(
          { success: false, error: "Vorlage nicht gefunden" },
          { status: 404 },
        );
      }

      // Neue Task aus Template erstellen
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

      const task = await this.createTaskUseCase.execute(newTaskData);

      return Response.json({ success: true, data: task }, { status: 201 });
    } catch (error) {
      if (error instanceof Error) {
        return Response.json(
          { success: false, error: error.message },
          { status: error.message.includes("Berechtigung") ? 403 : 400 },
        );
      }
      return Response.json(
        { success: false, error: "Template creation failed" },
        { status: 500 },
      );
    }
  }

  /**
   * @swagger
   * /api/internal/tasks/templates:
   *   get:
   *     summary: Verfügbare Task-Vorlagen
   *     tags: ["📋 Tasks"]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: kategorie
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Liste der Vorlagen
   */
  async getTemplates(req: Request): Promise<Response> {
    try {
      const url = new URL(req.url);
      const { userId, userRole } = req as any;

      const kategorie = url.searchParams.get("kategorie");

      const templates = await this.getTasksUseCase.execute({
        filters: {
          nurAktive: true,
          ...(kategorie && { kategorie }), // Nur hinzufügen wenn vorhanden
        },
        userId,
        userRole,
      });

      // Nur Standardaufgaben zurückgeben
      const filteredTemplates = templates.filter((t) => t.istStandardaufgabe);

      return Response.json({
        success: true,
        data: filteredTemplates,
        count: filteredTemplates.length,
      });
    } catch (error) {
      console.error("Error fetching templates:", error);
      return Response.json(
        { success: false, error: "Failed to fetch templates" },
        { status: 500 },
      );
    }
  }
}

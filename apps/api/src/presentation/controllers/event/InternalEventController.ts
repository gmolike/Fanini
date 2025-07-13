// apps/api/src/presentation/controllers/event/InternalEventController.ts
import { z } from "zod";
import type {
  CreateEventUseCase,
  UpdateEventUseCase,
  DeleteEventUseCase,
  ChangeEventStatusUseCase,
  GetInternalEventsUseCase,
  GetInternalEventByIdUseCase,
} from "@/application/use-cases/event";
import { EventStatus } from "@/domain/entities/Event";

// Validation Schemas
const createEventSchema = z.object({
  titel: z.string().min(3).max(255),
  beschreibung: z.string().min(10),
  kurzbeschreibung: z.string().max(500).optional(),
  datum: z.string().refine((val) => !isNaN(Date.parse(val))),
  uhrzeit: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  dauer_minuten: z.number().min(15).max(1440).optional(),
  ort: z.object({
    name: z.string().min(1),
    adresse: z.string().optional(),
    beschreibung: z.string().optional(),
  }),
  typ: z.enum([
    "vereinstreffen",
    "sportveranstaltung",
    "fanfahrt",
    "social",
    "sitzung",
    "workshop",
    "turnier",
    "sonstiges",
  ]),
  sportBereich: z
    .enum([
      "league_of_legends",
      "valorant",
      "fussball",
      "esports_allgemein",
      "sonstiges",
    ])
    .optional(),
  ist_oeffentlich: z.boolean().default(false),
  verantwortlich_id: z.string(),
  stellvertreter_ids: z.array(z.string()).optional(),
  budget: z.number().min(0).max(100000).optional(),
  max_teilnehmer: z.number().min(1).max(10000).optional(),
  anmeldeschluss: z.string().optional(),
  ticket_link: z.string().url().optional(),
});

const updateEventSchema = createEventSchema.partial();

const changeStatusSchema = z.object({
  status: z.enum([
    "entwurf",
    "geplant",
    "genehmigt",
    "aktiv",
    "abgeschlossen",
    "abgesagt",
  ]),
  kommentar: z.string().optional(),
});

export class InternalEventController {
  constructor(
    private readonly createEventUseCase: CreateEventUseCase,
    private readonly updateEventUseCase: UpdateEventUseCase,
    private readonly deleteEventUseCase: DeleteEventUseCase,
    private readonly changeEventStatusUseCase: ChangeEventStatusUseCase,
    private readonly getInternalEventsUseCase: GetInternalEventsUseCase,
    private readonly getInternalEventByIdUseCase: GetInternalEventByIdUseCase,
  ) {}

  /**
   * @swagger
   * /api/internal/events:
   *   post:
   *     summary: Event erstellen
   *     tags: ["📅 Events"]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CreateEvent'
   *     responses:
   *       201:
   *         description: Event erfolgreich erstellt
   *       400:
   *         description: Validierungsfehler
   *       403:
   *         description: Keine Berechtigung
   */
  async createEvent(req: Request): Promise<Response> {
    try {
      const body = await req.json();
      const validated = createEventSchema.parse(body);
      const { userId, userRole } = req as any;

      const event = await this.createEventUseCase.execute({
        ...validated,
        userId,
        userRole,
        ipAddress: req.headers.get("x-forwarded-for") || undefined,
        userAgent: req.headers.get("user-agent") || undefined,
      });

      return Response.json({ success: true, data: event }, { status: 201 });
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
        { success: false, error: "Event creation failed" },
        { status: 500 },
      );
    }
  }

  /**
   * @swagger
   * /api/internal/events/{id}:
   *   put:
   *     summary: Event aktualisieren
   *     tags: ["📅 Events"]
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
   *             $ref: '#/components/schemas/UpdateEvent'
   *     responses:
   *       200:
   *         description: Event erfolgreich aktualisiert
   *       403:
   *         description: Keine Berechtigung
   *       404:
   *         description: Event nicht gefunden
   */
  async updateEvent(req: Request): Promise<Response> {
    try {
      const { params } = req as any;
      const body = await req.json();
      const validated = updateEventSchema.parse(body);
      const { userId, userRole } = req as any;

      const event = await this.updateEventUseCase.execute({
        id: params.id,
        data: validated,
        userId,
        userRole,
        ipAddress: req.headers.get("x-forwarded-for") || undefined,
        userAgent: req.headers.get("user-agent") || undefined,
      });

      return Response.json({ success: true, data: event });
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
        { success: false, error: "Event update failed" },
        { status: 500 },
      );
    }
  }

  /**
   * @swagger
   * /api/internal/events/{id}:
   *   delete:
   *     summary: Event löschen (Soft Delete)
   *     tags: ["📅 Events"]
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
   *         description: Event erfolgreich gelöscht
   *       403:
   *         description: Keine Berechtigung
   *       404:
   *         description: Event nicht gefunden
   */
  async deleteEvent(req: Request): Promise<Response> {
    try {
      const { params } = req as any;
      const { userId, userRole } = req as any;

      await this.deleteEventUseCase.execute({
        id: params.id,
        userId,
        userRole,
        ipAddress: req.headers.get("x-forwarded-for") || undefined,
        userAgent: req.headers.get("user-agent") || undefined,
      });

      return Response.json({
        success: true,
        message: "Event erfolgreich gelöscht",
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
        { success: false, error: "Event deletion failed" },
        { status: 500 },
      );
    }
  }

  /**
   * @swagger
   * /api/internal/events/{id}/status:
   *   patch:
   *     summary: Event-Status ändern
   *     tags: ["📅 Events"]
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
   *                 enum: [entwurf, geplant, genehmigt, aktiv, abgeschlossen, abgesagt]
   *               kommentar:
   *                 type: string
   *     responses:
   *       200:
   *         description: Status erfolgreich geändert
   *       403:
   *         description: Keine Berechtigung für diese Status-Änderung
   */
  async changeEventStatus(req: Request): Promise<Response> {
    try {
      const { params } = req as any;
      const body = await req.json();
      const validated = changeStatusSchema.parse(body);
      const { userId, userRole } = req as any;

      const event = await this.changeEventStatusUseCase.execute({
        id: params.id,
        ...validated,
        userId,
        userRole,
        ipAddress: req.headers.get("x-forwarded-for") || undefined,
        userAgent: req.headers.get("user-agent") || undefined,
      });

      return Response.json({ success: true, data: event });
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
   * /api/internal/events/list:
   *   get:
   *     summary: Erweiterte Event-Liste (intern)
   *     tags: ["📅 Events"]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: status
   *         schema:
   *           type: string
   *       - in: query
   *         name: includeDeleted
   *         schema:
   *           type: boolean
   *       - in: query
   *         name: responsibleId
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Event-Liste mit erweiterten Daten
   */
  async getInternalEvents(req: Request): Promise<Response> {
    try {
      const url = new URL(req.url);
      const { userId, userRole } = req as any;

      // Status-Parameter validieren und casten
      const statusParam = url.searchParams.get("status");
      let status: EventStatus | undefined;

      if (statusParam) {
        const validStatuses: EventStatus[] = [
          "entwurf",
          "geplant",
          "genehmigt",
          "aktiv",
          "abgeschlossen",
          "abgesagt",
        ];

        if (validStatuses.includes(statusParam as EventStatus)) {
          status = statusParam as EventStatus;
        } else {
          return Response.json(
            {
              success: false,
              error: `Invalid status: ${statusParam}. Valid values are: ${validStatuses.join(", ")}`,
            },
            { status: 400 },
          );
        }
      }

      const filters = {
        status,
        includeDeleted: url.searchParams.get("includeDeleted") === "true",
        responsibleId: url.searchParams.get("responsibleId") || undefined,
        deputyId: url.searchParams.get("deputyId") || undefined,
        type: url.searchParams.get("type") || undefined,
        sportBereich: url.searchParams.get("sportBereich") || undefined,
        fromDate: url.searchParams.get("fromDate")
          ? new Date(url.searchParams.get("fromDate")!)
          : undefined,
        toDate: url.searchParams.get("toDate")
          ? new Date(url.searchParams.get("toDate")!)
          : undefined,
      };

      const events = await this.getInternalEventsUseCase.execute({
        filters,
        userId,
        userRole,
      });

      return Response.json({
        success: true,
        data: events,
        count: events.length,
      });
    } catch (error) {
      console.error("Error fetching internal events:", error);
      return Response.json(
        { success: false, error: "Failed to fetch events" },
        { status: 500 },
      );
    }
  }
  /**
   * @swagger
   * /api/internal/events/{id}:
   *   get:
   *     summary: Event-Details mit allen Relationen
   *     tags: ["📅 Events"]
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
   *         description: Vollständige Event-Details
   *       403:
   *         description: Keine Berechtigung
   *       404:
   *         description: Event nicht gefunden
   */
  async getInternalEventById(req: Request): Promise<Response> {
    try {
      const { params } = req as any;
      const { userId, userRole } = req as any;

      const event = await this.getInternalEventByIdUseCase.execute({
        id: params.id,
        userId,
        userRole,
      });

      if (!event) {
        return Response.json(
          { success: false, error: "Event nicht gefunden" },
          { status: 404 },
        );
      }

      return Response.json({ success: true, data: event });
    } catch (error) {
      if (error instanceof Error && error.message.includes("Berechtigung")) {
        return Response.json(
          { success: false, error: error.message },
          { status: 403 },
        );
      }
      console.error("Error fetching event details:", error);
      return Response.json(
        { success: false, error: "Failed to fetch event" },
        { status: 500 },
      );
    }
  }
}

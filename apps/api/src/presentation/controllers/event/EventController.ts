import { z } from "zod";
import type {
  GetEventsUseCase,
  CreateEventUseCase,
  UpdateEventUseCase,
  DeleteEventUseCase,
} from "@/application/use-cases";

const createEventSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string(),
  date: z.string().datetime(),
  location: z.string(),
});

export class EventController {
  constructor(
    private readonly getEventsUseCase: GetEventsUseCase,
    private readonly createEventUseCase: CreateEventUseCase,
    private readonly updateEventUseCase: UpdateEventUseCase,
    private readonly deleteEventUseCase: DeleteEventUseCase,
  ) {}

  /**
   * @swagger
   * /api/public/event/list:
   *   get:
   *     summary: Liste öffentlicher Events
   *     tags: ["🌐 Public Events"]
   *     responses:
   *       200:
   *         description: Erfolgreiche Antwort
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 data:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/Event'
   */
  async getPublicEventList(req: Request): Promise<Response> {
    try {
      const events = await this.getEventsUseCase.execute({
        filters: { status: "published" },
      });
      return Response.json({
        success: true,
        data: events.map((e) => e.toJSON()),
      });
    } catch (error) {
      return Response.json(
        { success: false, error: "Failed to fetch events" },
        { status: 500 },
      );
    }
  }
  /**
   * @swagger
   * /api/public/event/{eventId}:
   *   get:
   *     summary: Öffentliche Event-Details
   *     tags: ["🌐 Public Events"]
   *     parameters:
   *       - in: path
   *         name: eventId
   *         required: true
   *         schema:
   *           type: string
   *         description: Event ID
   *     responses:
   *       200:
   *         description: Event gefunden
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 data:
   *                   $ref: '#/components/schemas/Event'
   *       404:
   *         description: Event nicht gefunden
   */
  async getPublicEventDetail(req: Request): Promise<Response> {
    const { params } = req as any;
    try {
      const event = await this.getEventsUseCase.executeById(params.eventId);
      if (!event) {
        return Response.json(
          { success: false, error: "Event not found" },
          { status: 404 },
        );
      }
      return Response.json({
        success: true,
        data: event.toJSON(),
      });
    } catch (error) {
      return Response.json(
        { success: false, error: "Failed to fetch event" },
        { status: 500 },
      );
    }
  }

  /**
   * @swagger
   * /api/events:
   *   get:
   *     summary: Liste aller Events (geschützt)
   *     tags: ["📅 Events"]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Erfolgreiche Antwort
   *       401:
   *         description: Nicht autorisiert
   */
  async getEvents(req: Request): Promise<Response> {
    try {
      const userId = (req as any).userId;
      const events = await this.getEventsUseCase.execute({ userId });
      return Response.json({
        success: true,
        data: events.map((e) => e.toJSON()),
      });
    } catch (error) {
      return Response.json(
        { success: false, error: "Failed to fetch events" },
        { status: 500 },
      );
    }
  }

  async getEvent(req: Request): Promise<Response> {
    try {
      const { params } = req as any;
      const event = await this.getEventsUseCase.executeById(params.id);

      if (!event) {
        return Response.json(
          { success: false, error: "Event not found" },
          { status: 404 },
        );
      }

      return Response.json({
        success: true,
        data: event.toJSON(),
      });
    } catch (error) {
      return Response.json(
        { success: false, error: "Failed to fetch event" },
        { status: 500 },
      );
    }
  }

  /**
   * @swagger
   * /api/events:
   *   post:
   *     summary: Neues Event erstellen
   *     tags: ["📅 Events"]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - title
   *               - description
   *               - date
   *               - location
   *             properties:
   *               title:
   *                 type: string
   *               description:
   *                 type: string
   *               date:
   *                 type: string
   *                 format: date-time
   *               location:
   *                 type: string
   *     responses:
   *       201:
   *         description: Event erstellt
   *       400:
   *         description: Validierungsfehler
   *       401:
   *         description: Nicht autorisiert
   */
  async createEvent(req: Request): Promise<Response> {
    try {
      const userId = (req as any).userId;
      const body = await req.json();
      const validated = createEventSchema.parse(body);

      const event = await this.createEventUseCase.execute({
        ...validated,
        userId,
      });

      return Response.json(
        {
          success: true,
          data: event.toJSON(),
        },
        { status: 201 },
      );
    } catch (error) {
      if (error instanceof z.ZodError) {
        return Response.json(
          { success: false, errors: error.errors },
          { status: 400 },
        );
      }
      return Response.json(
        { success: false, error: "Failed to create event" },
        { status: 500 },
      );
    }
  }

  /**
   * @swagger
   * /api/events/{id}:
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
   *         description: Event ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               title:
   *                 type: string
   *               description:
   *                 type: string
   *               date:
   *                 type: string
   *                 format: date-time
   *               location:
   *                 type: string
   *               status:
   *                 type: string
   *                 enum: [draft, published, cancelled]
   *     responses:
   *       200:
   *         description: Event aktualisiert
   *       403:
   *         description: Keine Berechtigung
   *       404:
   *         description: Event nicht gefunden
   */
  async updateEvent(req: Request): Promise<Response> {
    try {
      const { params } = req as any;
      const userId = (req as any).userId;
      const body = await req.json();

      // Validate or assert the type of body
      const updateEventSchema = z.object({
        title: z.string().min(1).max(255).optional(),
        description: z.string().optional(),
        date: z.string().datetime().optional(),
        location: z.string().optional(),
        status: z.enum(["draft", "published", "cancelled"]).optional(),
      });

      const validatedBody = updateEventSchema.parse(body);

      const event = await this.updateEventUseCase.execute({
        id: params.id,
        data: validatedBody,
        userId,
      });

      return Response.json({
        success: true,
        data: event.toJSON(),
      });
    } catch (error: any) {
      if (error.message === "Event not found") {
        return Response.json(
          { success: false, error: error.message },
          { status: 404 },
        );
      }
      if (error.message === "Unauthorized to edit this event") {
        return Response.json(
          { success: false, error: error.message },
          { status: 403 },
        );
      }
      return Response.json(
        { success: false, error: "Failed to update event" },
        { status: 500 },
      );
    }
  }

  /**
   * @swagger
   * /api/events/{id}:
   *   delete:
   *     summary: Event löschen
   *     tags: ["📅 Events"]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Event ID
   *     responses:
   *       200:
   *         description: Event gelöscht
   *       403:
   *         description: Keine Berechtigung
   *       404:
   *         description: Event nicht gefunden
   */
  async deleteEvent(req: Request): Promise<Response> {
    try {
      const { params } = req as any;
      const userId = (req as any).userId;

      await this.deleteEventUseCase.execute({
        id: params.id,
        userId,
      });

      return Response.json({
        success: true,
        message: "Event deleted successfully",
      });
    } catch (error: any) {
      if (error.message === "Event not found") {
        return Response.json(
          { success: false, error: error.message },
          { status: 404 },
        );
      }
      if (error.message === "Unauthorized to delete this event") {
        return Response.json(
          { success: false, error: error.message },
          { status: 403 },
        );
      }
      return Response.json(
        { success: false, error: "Failed to delete event" },
        { status: 500 },
      );
    }
  }
}

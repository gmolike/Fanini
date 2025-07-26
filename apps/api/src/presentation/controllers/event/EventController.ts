// apps/api/src/presentation/controllers/event/EventController.ts
import type {
  GetEventByIdUseCase,
  GetEventsUseCase,
} from "@/application/use-cases";
import { toPublicEventListItem } from "./dtos/public-event.dto";
import { eventToJSON } from "@/domain/entities/Event";

export type EventController = {
  getPublicEventList: (req: Request) => Promise<Response>;
  getPublicEventDetail: (req: Request) => Promise<Response>;
};

export const createEventController = (
  getEventsUseCase: GetEventsUseCase,
  getEventByIdUseCase: GetEventByIdUseCase,
): EventController => ({
  /**
   * @swagger
   * /api/public/event/list:
   *   get:
   *     summary: Liste öffentlicher Events
   *     tags: ["🌐 Public Events"]
   *     parameters:
   *       - in: query
   *         name: type
   *         schema:
   *           type: string
   *       - in: query
   *         name: sportBereich
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Event-Liste mit Meta-Informationen
   */
  getPublicEventList: async (req: Request) => {
    try {
      const url = new URL(req.url);
      const type = url.searchParams.get("type") || undefined;
      const sportBereich = url.searchParams.get("sportBereich") || undefined;

      // Use Case liefert Domain Events
      const events = await getEventsUseCase.execute({
        filters: {
          status: "genehmigt",
          isPublic: true,
          type,
          sportBereich,
        },
      });

      // Transformiere zu Public DTOs
      const publicEvents = events.map(toPublicEventListItem);

      // Public API Response ohne success flag
      return Response.json({
        data: publicEvents,
        meta: {
          total: publicEvents.length,
          page: 1,
          limit: 20,
          hasMore: false,
        },
      });
    } catch (error) {
      console.error("Error fetching public events:", error);
      return Response.json(
        { error: "Failed to fetch events" },
        { status: 500 },
      );
    }
  },

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
   *     responses:
   *       200:
   *         description: Event-Details
   *       404:
   *         description: Event nicht gefunden
   */
  getPublicEventDetail: async (req: Request) => {
    try {
      const { params } = req as any;
      const event = await getEventByIdUseCase.execute({
        id: params.eventId,
      });

      if (!event) {
        return Response.json({ error: "Event not found" }, { status: 404 });
      }

      // TODO: Erstelle PublicEventDetailDto wenn Detail-View implementiert wird
      // Vorerst nutzen wir eventToJSON
      return Response.json({
        data: eventToJSON(event),
      });
    } catch (error) {
      console.error("Error fetching event details:", error);
      return Response.json({ error: "Failed to fetch event" }, { status: 500 });
    }
  },
});

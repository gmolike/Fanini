// apps/api/src/presentation/controllers/event-controller.ts
import { GetEventByIdUseCase, GetEventsUseCase } from "@/application/use-cases";
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
   *         description: Event-Liste
   */
  getPublicEventList: async (req: Request) => {
    try {
      const url = new URL(req.url);
      const type = url.searchParams.get("type") || undefined;
      const sportBereich = url.searchParams.get("sportBereich") || undefined;

      const events = await getEventsUseCase.execute({
        filters: {
          status: "genehmigt",
          isPublic: true,
          type,
          sportBereich,
        },
      });

      return Response.json({
        success: true,
        data: events.map(eventToJSON),
        count: events.length,
      });
    } catch (error) {
      console.error("Error fetching public events:", error);
      return Response.json(
        { success: false, error: "Failed to fetch events" },
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
   */
  getPublicEventDetail: async (req: Request) => {
    try {
      const { params } = req as any;
      const event = await getEventByIdUseCase.execute({
        id: params.eventId,
      });

      if (!event) {
        return Response.json(
          { success: false, error: "Event not found" },
          { status: 404 },
        );
      }

      return Response.json({
        success: true,
        data: eventToJSON(event),
      });
    } catch (error) {
      console.error("Error fetching event details:", error);
      return Response.json(
        { success: false, error: "Failed to fetch event" },
        { status: 500 },
      );
    }
  },
});

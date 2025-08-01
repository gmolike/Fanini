// apps/api/src/presentation/controllers/event/EventController.ts
import type { Event } from "@/domain/entities/Event";
import { toPublicEventListItem } from "./dtos/public-event.dto";
import { eventToJSON } from "@/domain/entities/Event";

export type EventController = {
  getPublicEventList: (req: Request) => Promise<Response>;
  getPublicEventDetail: (req: Request) => Promise<Response>;
};

export const createEventController = (
  getPublicEventsUseCase: any, // GetPublicEventsUseCase
  getPublicEventByIdUseCase: any, // GetPublicEventByIdUseCase
): EventController => ({
  /**
   * Get public event list
   */
  getPublicEventList: async (req: Request) => {
    try {
      const url = new URL(req.url);

      const params = {
        filters: {
          type: url.searchParams.get("type") || undefined,
          sportBereich: url.searchParams.get("sportBereich") || undefined,
        },
      };

      const result = await getPublicEventsUseCase.execute(params);

      return Response.json({
        data: result.items,
        meta: {
          total: result.pagination.totalItems,
          page: result.pagination.page,
          limit: result.pagination.pageSize,
          hasMore: result.pagination.hasNext,
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
   * Get public event detail
   */
  getPublicEventDetail: async (req: Request) => {
    try {
      const { params } = req as any;
      const result = await getPublicEventByIdUseCase.execute({
        id: params.eventId,
      });

      if (!result) {
        return Response.json({ error: "Event not found" }, { status: 404 });
      }

      return Response.json({
        data: result,
      });
    } catch (error) {
      console.error("Error fetching event details:", error);
      return Response.json({ error: "Failed to fetch event" }, { status: 500 });
    }
  },
});

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
    private getEventsUseCase: GetEventsUseCase,
    private createEventUseCase: CreateEventUseCase,
    private updateEventUseCase: UpdateEventUseCase,
    private deleteEventUseCase: DeleteEventUseCase,
  ) {}

  async getPublicEvents(req: Request): Promise<Response> {
    try {
      const events = await this.getEventsUseCase.execute({});
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

  async updateEvent(req: Request): Promise<Response> {
    try {
      const { params } = req as any;
      const userId = (req as any).userId;
      const body = await req.json();

      const event = await this.updateEventUseCase.execute({
        id: params.id,
        data: body,
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

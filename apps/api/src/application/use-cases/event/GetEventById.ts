import type { IEventRepository } from "@/domain/repositories/IEventRepository";
import type { Event } from "@/domain/entities/Event";

export type GetEventByIdUseCase = {
  execute: (params: { id: string; userId?: string }) => Promise<Event | null>;
};

export const createGetEventByIdUseCase = (
  eventRepository: IEventRepository, 
): GetEventByIdUseCase => ({
  execute: async ({ id, userId }) => {
    const event = await eventRepository.findById(id);

    if (!event) return null;

    if (!userId && (!event.isPublic || event.status !== "genehmigt")) {
      return null;
    }

    return event;
  },
});

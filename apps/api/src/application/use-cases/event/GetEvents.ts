import type {
  IEventRepository,
  EventFilters,
} from "@/domain/repositories/IEventRepository";
import type { Event } from "@/domain/entities/Event";

export type GetEventsUseCase = {
  execute: (params: {
    filters?: EventFilters;
    userId?: string;
  }) => Promise<Event[]>;
};

export const createGetEventsUseCase = (
  eventRepository: IEventRepository,
): GetEventsUseCase => ({
  execute: async ({ filters = {}, userId }) => {
    if (!userId) {
      filters.status = "genehmigt";
      filters.isPublic = true;
    }

    return await eventRepository.findAll(filters);
  },
});

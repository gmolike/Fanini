// apps/api/src/application/use-cases/events/GetEventsUseCase.ts
import type {
  EventRepository,
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
  eventRepository: EventRepository,
): GetEventsUseCase => ({
  execute: async ({ filters = {}, userId }) => {
    // Business Rule: Nicht eingeloggte User sehen nur öffentliche published Events
    if (!userId) {
      filters.status = "genehmigt";
      filters.isPublic = true;
    }

    return await eventRepository.findAll(filters);
  },
});

import {
  IEventRepository,
  EventFilters,
} from "@/domain/repositories/IEventRepository";
import { Event } from "@/domain/entities/Event";

export class GetEventsUseCase {
  constructor(private eventRepository: IEventRepository) {}

  async execute(params: {
    filters?: EventFilters;
    userId?: string;
  }): Promise<Event[]> {
    const filters = params.filters || {};

    // Business Rule: Nicht eingeloggte User sehen nur published Events
    if (!params.userId) {
      filters.status = "published";
    }

    return await this.eventRepository.findAll(filters);
  }

  async executeById(id: string): Promise<Event | null> {
    return await this.eventRepository.findById(id);
  }
}

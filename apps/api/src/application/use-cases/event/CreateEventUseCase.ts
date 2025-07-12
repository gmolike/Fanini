import { IEventRepository } from '@/domain/repositories/IEventRepository';
import { Event } from '@/domain/entities/Event';

export class CreateEventUseCase {
  constructor(private eventRepository: IEventRepository) {}

  async execute(params: {
    title: string;
    description: string;
    date: string;
    location: string;
    userId: string;
  }): Promise<Event> {
    // Business Rule: Event date cannot be in the past
    const eventDate = new Date(params.date);
    if (eventDate < new Date()) {
      throw new Error('Event date cannot be in the past');
    }

    // Create domain entity
    const event = Event.create({
      title: params.title,
      description: params.description,
      date: eventDate,
      location: params.location,
      createdBy: params.userId
    });

    // Persist
    return await this.eventRepository.save(event);
  }
}

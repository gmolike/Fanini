import { IEventRepository } from '@/domain/repositories/IEventRepository';
import { Event } from '@/domain/entities/Event';

export class UpdateEventUseCase {
  constructor(private eventRepository: IEventRepository) {}

  async execute(params: {
    id: string;
    data: Partial<{
      title: string;
      description: string;
      date: string;
      location: string;
      status: string;
    }>;
    userId: string;
  }): Promise<Event> {
    const event = await this.eventRepository.findById(params.id);
    if (!event) {
      throw new Error('Event not found');
    }

    // Business Rule: Only creator can edit
    if (!event.canBeEditedBy(params.userId)) {
      throw new Error('Unauthorized to edit this event');
    }

    // Update fields
    const updatedEvent = new Event(
      event.id,
      params.data.title || event.title,
      params.data.description || event.description,
      params.data.date ? new Date(params.data.date) : event.date,
      params.data.location || event.location,
      (params.data.status as any) || event.status,
      event.createdBy,
      event.createdAt,
      new Date() // updatedAt
    );

    return await this.eventRepository.save(updatedEvent);
  }
}

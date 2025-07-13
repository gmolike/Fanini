import { IEventRepository } from '@/domain/repositories/IEventRepository';

export class DeleteEventUseCase {
  constructor(private eventRepository: IEventRepository) {}

  async execute(params: {
    id: string;
    userId: string;
  }): Promise<void> {
    const event = await this.eventRepository.findById(params.id);
    if (!event) {
      throw new Error('Event not found');
    }

    // Business Rule: Only creator can delete
    if (event.createdBy !== params.userId) {
      throw new Error('Unauthorized to delete this event');
    }

    await this.eventRepository.delete(params.id);
  }
}

// apps/api/src/application/use-cases/event/GetPublicEvents.ts
import type { IEventRepository } from "@/domain/repositories/IEventRepository";
import type { Event } from "@/domain/entities/Event";

export type GetPublicEventsUseCase = {
  execute: (params?: {
    type?: string;
    sportBereich?: string;
  }) => Promise<Event[]>;
};

export const createGetPublicEventsUseCase = (
  eventRepository: IEventRepository,
): GetPublicEventsUseCase => ({
  execute: async (params = {}) => {
    // Business Logic: Nur genehmigte, öffentliche Events
    const events = await eventRepository.findAll({
      status: "genehmigt",
      isPublic: true,
      type: params.type,
      sportBereich: params.sportBereich,
    });

    return events;
  },
});

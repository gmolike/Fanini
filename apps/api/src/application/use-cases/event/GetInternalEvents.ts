// apps/api/src/application/use-cases/event/GetInternalEventsUseCase.ts
import { Event } from '@/domain/entities/Event';
import { IEventRepository, EventFilters } from '@/domain/repositories/IEventRepository';
import { IMemberRepository } from '@/domain/repositories/IMemberRepository';

export type GetInternalEventsParams = {
  filters?: EventFilters & {
    includeDeleted?: boolean;
    responsibleId?: string;
    deputyId?: string;
  };
  userId: string;
  userRole: string;
};

export type EventWithRelations = Event & {
  responsible: {
    id: string;
    vorname: string;
    nachname: string;
    email: string;
  };
  deputies?: Array<{
    id: string;
    vorname: string;
    nachname: string;
  }>;
  participantCount?: number;
  taskCount?: number;
  completedTaskCount?: number;
};

export class GetInternalEventsUseCase {
  constructor(
    private eventRepository: IEventRepository,
    private memberRepository: IMemberRepository
  ) {}

  async execute(params: GetInternalEventsParams): Promise<EventWithRelations[]> {
    // 1. Events basierend auf Rolle filtern
    const filters = { ...params.filters };

    // Team Event sieht nur eigene und öffentliche Events
    if (params.userRole === 'TEAM_EVENT') {
      filters.createdBy = params.userId;
    }

    // 2. Events laden
    const events = await this.eventRepository.findAll(filters);

    // 3. Relations laden
    const eventsWithRelations: EventWithRelations[] = [];

    for (const event of events) {
      // Verantwortlicher laden
      const responsible = await this.memberRepository.findById(event.responsibleMemberId);

      // Stellvertreter laden
      const deputies = [];
      if (event.deputyMemberIds) {
        for (const deputyId of event.deputyMemberIds) {
          const deputy = await this.memberRepository.findById(deputyId);
          if (deputy) {
            deputies.push({
              id: deputy.id,
              vorname: deputy.vorname,
              nachname: deputy.nachname
            });
          }
        }
      }

      // Stats laden
      const participantCount = await this.eventRepository.getParticipantCount(event.id);
      const { total, completed } = await this.eventRepository.getTaskStats(event.id);

      eventsWithRelations.push({
        ...event,
        responsible: {
          id: responsible.id,
          vorname: responsible.vorname,
          nachname: responsible.nachname,
          email: responsible.email
        },
        deputies,
        participantCount,
        taskCount: total,
        completedTaskCount: completed
      });
    }

    return eventsWithRelations;
  }
}

// apps/api/src/application/use-cases/event/GetInternalEventByIdUseCase.ts
import { IEventRepository } from '@/domain/repositories/IEventRepository';
import { IMemberRepository } from '@/domain/repositories/IMemberRepository';
import { IPermissionService } from '@/domain/services/IPermissionService';
import { EventWithRelations } from './GetInternalEvents';

export type GetInternalEventByIdParams = {
  id: string;
  userId: string;
  userRole: string;
};

export type DetailedEventWithRelations = EventWithRelations & {
  auditLog: Array<{
    action: string;
    fieldName?: string;
    oldValue?: string;
    newValue?: string;
    changedBy: {
      id: string;
      name: string;
    };
    changedAt: Date;
  }>;
  participants?: Array<{
    id: string;
    name: string;
    status: string;
    registeredAt: Date;
  }>;
  tasks?: Array<{
    id: string;
    title: string;
    status: string;
    assignee?: {
      id: string;
      name: string;
    };
  }>;
};

export class GetInternalEventByIdUseCase {
  constructor(
    private eventRepository: IEventRepository,
    private memberRepository: IMemberRepository,
    private permissionService: IPermissionService
  ) {}

  async execute(params: GetInternalEventByIdParams): Promise<DetailedEventWithRelations | null> {
    // 1. Event laden
    const event = await this.eventRepository.findById(params.id);
    if (!event) {
      return null;
    }

    // 2. Berechtigungsprüfung
    const canView = await this.permissionService.canViewInternalEvent(
      params.userRole,
      params.userId,
      event
    );
    if (!canView) {
      throw new Error('Keine Berechtigung zum Anzeigen dieses Events');
    }

    // 3. Basis-Relations laden (wie in GetInternalEvents)
    const responsible = await this.memberRepository.findById(event.responsibleMemberId);

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

    // 4. Erweiterte Daten laden
    const auditLog = await this.eventRepository.getAuditLog(event.id);
    const participants = await this.eventRepository.getParticipants(event.id);
    const tasks = await this.eventRepository.getTasks(event.id);
    const { total, completed } = await this.eventRepository.getTaskStats(event.id);

    // 5. Audit-Log mit User-Namen anreichern
    const enrichedAuditLog = [];
    for (const entry of auditLog) {
      const user = await this.memberRepository.findById(entry.changedBy);
      enrichedAuditLog.push({
        ...entry,
        changedBy: {
          id: entry.changedBy,
          name: user ? `${user.vorname} ${user.nachname}` : 'Unbekannt'
        }
      });
    }

    return {
      ...event,
      responsible: {
        id: responsible.id,
        vorname: responsible.vorname,
        nachname: responsible.nachname,
        email: responsible.email
      },
      deputies,
      participantCount: participants.length,
      taskCount: total,
      completedTaskCount: completed,
      auditLog: enrichedAuditLog,
      participants,
      tasks
    };
  }
}

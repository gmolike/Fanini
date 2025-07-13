// apps/api/src/application/use-cases/event/ChangeEventStatusUseCase.ts
import { Event, EventStatus } from '@/domain/entities/Event';
import { IEventRepository } from '@/domain/repositories/IEventRepository';
import { IPermissionService } from '@/domain/services/IPermissionService';

export type ChangeEventStatusParams = {
  id: string;
  status: EventStatus;
  kommentar?: string;
  userId: string;
  userRole: string;
  ipAddress?: string;
  userAgent?: string;
};

export class ChangeEventStatusUseCase {
  constructor(
    private readonly eventRepository: IEventRepository,
    private readonly permissionService: IPermissionService
  ) {}

  async execute(params: ChangeEventStatusParams): Promise<Event> {
    // 1. Event laden
    const event = await this.eventRepository.findById(params.id);
    if (!event) {
      throw new Error('Event nicht gefunden');
    }

    // 2. Workflow-Validierung
    const allowedTransitions = this.getAllowedStatusTransitions(event.status);
    if (!allowedTransitions.includes(params.status)) {
      throw new Error(
        `Übergang von ${event.status} zu ${params.status} nicht erlaubt`
      );
    }

    // 3. Berechtigungsprüfung für Status-Änderung
    const canChangeStatus = await this.permissionService.canChangeEventStatus(
      params.userRole,
      params.userId,
      event,
      params.status
    );
    if (!canChangeStatus) {
      throw new Error('Keine Berechtigung für diese Status-Änderung');
    }

    // 4. Spezielle Validierungen
    if (params.status === 'genehmigt') {
      if (!event.budget && event.type !== 'vereinstreffen') {
        throw new Error('Budget muss vor Genehmigung festgelegt werden');
      }
    }

    // 5. Status ändern mit Audit
    const auditEntry = {
      eventId: event.id,
      action: 'status_changed' as const,
      fieldName: 'status',
      oldValue: event.status,
      newValue: params.status,
      changedBy: params.userId,
      ipAddress: params.ipAddress,
      userAgent: params.userAgent
    };

    const updatedEvent: Event = {
      ...event,
      status: params.status,
      updatedAt: new Date(),
      updatedBy: params.userId
    };

    // Bei Genehmigung zusätzliche Felder setzen
    if (params.status === 'genehmigt') {
      updatedEvent.approvedAt = new Date();
      updatedEvent.approvedBy = params.userId;
    }

    const savedEvent = await this.eventRepository.updateWithAudit(
      updatedEvent,
      [auditEntry]
    );

    return savedEvent;
  }

  private getAllowedStatusTransitions(currentStatus: EventStatus): EventStatus[] {
    const transitions: Record<EventStatus, EventStatus[]> = {
      'entwurf': ['geplant', 'abgesagt'],
      'geplant': ['genehmigt', 'abgesagt'],
      'genehmigt': ['aktiv', 'abgesagt'],
      'aktiv': ['abgeschlossen', 'abgesagt'],
      'abgeschlossen': [],
      'abgesagt': ['entwurf'] // Reaktivierung nur als Entwurf
    };

    return transitions[currentStatus] || [];
  }
}

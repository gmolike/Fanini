// apps/api/src/domain/services/IPermissionService.ts
import { Event, EventStatus } from '../entities/Event';

export interface IPermissionService {
  canCreateEvent(userRole: string): Promise<boolean>;

  canEditEvent(
    userRole: string,
    userId: string,
    event: Event
  ): Promise<boolean>;

  canDeleteEvent(
    userRole: string,
    userId: string,
    event: Event
  ): Promise<boolean>;

  canChangeEventStatus(
    userRole: string,
    userId: string,
    event: Event,
    newStatus: EventStatus
  ): Promise<boolean>;

  canViewInternalEvent(
    userRole: string,
    userId: string,
    event: Event
  ): Promise<boolean>;
}

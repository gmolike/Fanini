// apps/api/src/domain/repositories/IEventRepository.ts
import type { Event, EventStatus } from "../entities/Event";

export type EventFilters = {
  status?: EventStatus;
  isPublic?: boolean;
  createdBy?: string;
  fromDate?: Date;
  toDate?: Date;
  type?: string;
  sportBereich?: string;
  includeDeleted?: boolean;
  responsibleId?: string;
  deputyId?: string;
};

export type AuditLogEntry = {
  eventId: string;
  action: 'created' | 'updated' | 'status_changed' | 'deleted';
  fieldName: string | null;
  oldValue: string | null;
  newValue: string | null;
  changedBy: string;
  ipAddress?: string;
  userAgent?: string;
};

export interface IEventRepository {
  findAll(filters?: EventFilters): Promise<Event[]>;
  findById(id: string): Promise<Event | null>;
  save(event: Event): Promise<Event>;
  delete(id: string): Promise<void>;

  // Neue Methoden für Phase 2
  updateWithAudit(event: Event, auditEntries: AuditLogEntry[]): Promise<Event>;
  softDeleteWithAudit(id: string, deletedBy: string, auditEntry: AuditLogEntry): Promise<void>;
  createStatusHistory(params: {
    eventId: string;
    oldStatus?: EventStatus;
    newStatus: EventStatus;
    changedBy: string;
    comment?: string;
  }): Promise<void>;

  getAuditLog(eventId: string): Promise<Array<{
    action: string;
    fieldName?: string;
    oldValue?: string;
    newValue?: string;
    changedBy: string;
    changedAt: Date;
  }>>;

  getParticipantCount(eventId: string): Promise<number>;
  getParticipants(eventId: string): Promise<Array<{
    id: string;
    name: string;
    status: string;
    registeredAt: Date;
  }>>;

  getTaskStats(eventId: string): Promise<{ total: number; completed: number }>;
  getTasks(eventId: string): Promise<Array<{
    id: string;
    title: string;
    status: string;
    assignee?: {
      id: string;
      name: string;
    };
  }>>;
}

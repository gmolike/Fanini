// apps/api/src/domain/repositories/event-repository.ts
import type { Event, EventStatus } from "../entities/Event";

export type EventFilters = {
  status?: EventStatus;
  isPublic?: boolean;
  createdBy?: string;
  fromDate?: Date;
  toDate?: Date;
  type?: string;
  sportBereich?: string;
};

export type EventRepository = {
  findAll: (filters?: EventFilters) => Promise<Event[]>;
  findById: (id: string) => Promise<Event | null>;
  save: (event: Event) => Promise<Event>;
  delete: (id: string) => Promise<void>;
};

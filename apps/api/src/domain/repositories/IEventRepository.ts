import { Event, EventStatus } from "../entities/Event";

export interface EventFilters {
  status?: EventStatus;
  createdBy?: string;
  fromDate?: Date;
  toDate?: Date;
}

export interface IEventRepository {
  findAll(filters?: EventFilters): Promise<Event[]>;
  findById(id: string): Promise<Event | null>;
  save(event: Event): Promise<Event>;
  delete(id: string): Promise<void>;
}

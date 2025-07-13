// apps/api/src/domain/entities/event.ts
import { generateId } from "@faninitiative/shared";

// apps/api/src/domain/entities/event.ts
export type EventStatus =
  | "entwurf"
  | "geplant"
  | "genehmigt"
  | "aktiv"
  | "abgeschlossen"
  | "abgesagt";
export type EventType =
  | "vereinstreffen"
  | "sportveranstaltung"
  | "fanfahrt"
  | "social"
  | "sitzung"
  | "workshop"
  | "turnier"
  | "sonstiges";

export type SportBereich =
  | "league_of_legends"
  | "fussball"
  | "esports_allgemein"
  | "sonstiges";

export type EventLocation = {
  name: string;
  address?: string;
  description?: string;
};

export type Event = {
  id: string;
  title: string;
  description: string;
  shortDescription?: string;
  date: Date;
  time: string;
  durationMinutes?: number;
  location: EventLocation;
  type: EventType;
  sportBereich?: SportBereich;
  status: EventStatus;
  isPublic: boolean;
  isConfidential: boolean;
  responsibleMemberId: string;
  deputyMemberIds?: string[];
  budget?: number;
  budgetUsed: number;
  maxParticipants?: number;
  registrationDeadline?: Date;
  ticketLink?: string;
  createdAt: Date;
  createdBy: string;
  updatedAt: Date;
  updatedBy?: string;
  approvedAt?: Date;
  approvedBy?: string;
};

export const createEvent = (params: {
  title: string;
  description: string;
  shortDescription?: string;
  date: Date;
  time: string;
  location: EventLocation;
  type: EventType;
  responsibleMemberId: string;
  createdBy: string;
  isPublic?: boolean;
}): Event => {
  const now = new Date();
  return {
    id: generateId(),
    title: params.title,
    description: params.description,
    shortDescription: params.shortDescription,
    date: params.date,
    time: params.time,
    location: params.location,
    type: params.type,
    status: "entwurf",
    isPublic: params.isPublic || false,
    isConfidential: false,
    responsibleMemberId: params.responsibleMemberId,
    budgetUsed: 0,
    createdAt: now,
    createdBy: params.createdBy,
    updatedAt: now,
  };
};

export const canEventBeEditedBy = (event: Event, userId: string): boolean => {
  return event.createdBy === userId || event.status === "entwurf";
};

export const eventToJSON = (event: Event) => ({
  id: event.id,
  title: event.title,
  description: event.description,
  shortDescription: event.shortDescription,
  date: event.date.toISOString(),
  time: event.time,
  durationMinutes: event.durationMinutes,
  location: event.location,
  type: event.type,
  sportBereich: event.sportBereich,
  status: event.status,
  isPublic: event.isPublic,
  maxParticipants: event.maxParticipants,
  registrationDeadline: event.registrationDeadline?.toISOString(),
  ticketLink: event.ticketLink,
  createdAt: event.createdAt.toISOString(),
  updatedAt: event.updatedAt.toISOString(),
});

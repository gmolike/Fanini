// apps/api/src/application/dto/event/CreateEventDTO.ts

import { EventTypeDTO, SportBereichDTO } from "./EventListDTO";

/**
 * Create Event DTO
 * @description Daten für Event-Erstellung
 */
export type CreateEventDTO = {
  /** Event Titel (max 100 Zeichen) */
  readonly title: string;

  /** Vollständige Beschreibung */
  readonly description: string;

  /** Kurzbeschreibung (max 200 Zeichen) */
  readonly shortDescription?: string;

  /** Event Datum (YYYY-MM-DD) */
  readonly date: string;

  /** Uhrzeit (HH:MM) */
  readonly time: string;

  /** Dauer in Minuten */
  readonly durationMinutes?: number;

  /** Veranstaltungsort */
  readonly location: CreateEventLocationDTO;

  /** Event Typ */
  readonly type: EventTypeDTO;

  /** Sportbereich (wenn type = sportveranstaltung) */
  readonly sportBereich?: SportBereichDTO;

  /** Ist öffentlich sichtbar? */
  readonly isPublic: boolean;

  /** Verantwortliche Person ID */
  readonly responsibleMemberId: string;

  /** Stellvertreter IDs */
  readonly deputyMemberIds?: string[];

  /** Budget (nur Vorstand) */
  readonly budget?: number;

  /** Maximale Teilnehmerzahl */
  readonly maxParticipants?: number;

  /** Anmeldeschluss (YYYY-MM-DD HH:MM) */
  readonly registrationDeadline?: string;

  /** Externe Ticket-URL */
  readonly ticketLink?: string;

  /** Standard-Aufgaben Template IDs */
  readonly taskTemplateIds?: string[];
};

/**
 * Create Event Location DTO
 */
export type CreateEventLocationDTO = {
  /** Ortsname */
  readonly name: string;

  /** Adresse */
  readonly address?: string;

  /** Zusätzliche Beschreibung */
  readonly description?: string;
};

/**
 * Validation Rules für Event Creation
 */
export const CREATE_EVENT_VALIDATION = {
  title: {
    minLength: 3,
    maxLength: 100,
    required: true,
  },
  description: {
    minLength: 10,
    maxLength: 5000,
    required: true,
  },
  shortDescription: {
    maxLength: 200,
    required: false,
  },
  date: {
    minDate: "today",
    required: true,
  },
  time: {
    pattern: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
    required: true,
  },
  budget: {
    min: 0,
    max: 100000,
    requiresRole: ["VORSTAND"],
  },
} as const;

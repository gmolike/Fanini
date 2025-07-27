// apps/api/src/application/dto/event/UpdateEventDTO.ts

import { CreateEventLocationDTO } from "./CreateEventDTO";
import { EventStatusDTO, EventTypeDTO, SportBereichDTO } from "./EventListDTO";

/**
 * Update Event DTO
 * @description Daten für Event-Aktualisierung
 */
export type UpdateEventDTO = {
  /** Event Titel */
  readonly title?: string;

  /** Vollständige Beschreibung */
  readonly description?: string;

  /** Kurzbeschreibung */
  readonly shortDescription?: string;

  /** Event Datum (YYYY-MM-DD) */
  readonly date?: string;

  /** Uhrzeit (HH:MM) */
  readonly time?: string;

  /** Dauer in Minuten */
  readonly durationMinutes?: number;

  /** Veranstaltungsort */
  readonly location?: CreateEventLocationDTO;

  /** Event Typ */
  readonly type?: EventTypeDTO;

  /** Sportbereich */
  readonly sportBereich?: SportBereichDTO;

  /** Ist öffentlich sichtbar? */
  readonly isPublic?: boolean;

  /** Verantwortliche Person ID */
  readonly responsibleMemberId?: string;

  /** Stellvertreter IDs */
  readonly deputyMemberIds?: string[];

  /** Budget (nur Vorstand) */
  readonly budget?: number;

  /** Maximale Teilnehmerzahl */
  readonly maxParticipants?: number;

  /** Anmeldeschluss */
  readonly registrationDeadline?: string;

  /** Externe Ticket-URL */
  readonly ticketLink?: string;

  /** Status-Änderung (separate Berechtigung) */
  readonly status?: EventStatusDTO;

  /** Kommentar zur Änderung */
  readonly changeComment?: string;
};

/**
 * Event Status Change DTO
 * @description Separates DTO für Status-Änderungen
 */
export type ChangeEventStatusDTO = {
  /** Neuer Status */
  readonly status: EventStatusDTO;

  /** Begründung/Kommentar */
  readonly comment?: string;

  /** Bei Absage: Grund */
  readonly cancellationReason?: string;
};

/**
 * Felder die nach Genehmigung nicht mehr änderbar sind
 */
export const LOCKED_FIELDS_AFTER_APPROVAL = [
  "date",
  "time",
  "location",
  "type",
  "budget",
  "responsibleMemberId"
] as const;

/**
 * Prüft ob ein Feld nach Genehmigung änderbar ist
 */
export const isFieldEditableAfterApproval = (
  fieldName: keyof UpdateEventDTO,
  userRole: string
): boolean => {
  if (userRole === "VORSTAND" || userRole === "ADMIN") {
    return true;
  }

  return !LOCKED_FIELDS_AFTER_APPROVAL.includes(fieldName as any);
};

// apps/api/src/application/dto/event/EventDetailDTO.ts

import type {
  EventLocationDTO,
  EventTypeDTO,
  SportBereichDTO,
  EventStatusDTO,
  MemberReferenceDTO,
  EventPermissionsDTO
} from "./EventListDTO";

/**
 * Public Event Detail DTO
 * @description Öffentlich sichtbare Event-Details
 */
export type PublicEventDetailDTO = {
  /** Event ID */
  readonly id: string;

  /** Event Titel */
  readonly title: string;

  /** Vollständige Beschreibung (HTML) */
  readonly description: string;

  /** Kurzbeschreibung */
  readonly shortDescription?: string;

  /** Event Datum (ISO 8601) */
  readonly date: string;

  /** Uhrzeit (HH:MM) */
  readonly time: string;

  /** Dauer in Minuten */
  readonly durationMinutes?: number;

  /** Veranstaltungsort */
  readonly location: EventLocationDTO;

  /** Event Typ */
  readonly type: EventTypeDTO;

  /** Sportbereich */
  readonly sportBereich?: SportBereichDTO;

  /** Maximale Teilnehmerzahl */
  readonly maxParticipants?: number;

  /** Aktuelle Teilnehmer */
  readonly participants: PublicParticipantDTO[];

  /** Anmeldeschluss (ISO 8601) */
  readonly registrationDeadline?: string;

  /** Externe Ticket-URL */
  readonly ticketLink?: string;

  /** Ist Anmeldung möglich? */
  readonly canRegister: boolean;

  /** Medien (Bilder/Videos) */
  readonly media: EventMediaDTO[];

  /** Öffentlich sichtbare Aufgaben */
  readonly publicTasks?: PublicTaskDTO[];
};

/**
 * Internal Event Detail DTO
 * @description Vollständige Event-Details für interne Nutzer
 */
export type InternalEventDetailDTO = PublicEventDetailDTO & {
  /** Event Status */
  readonly status: EventStatusDTO;

  /** Verantwortliche Person */
  readonly responsibleMember: MemberReferenceDTO;

  /** Stellvertreter */
  readonly deputyMembers: MemberReferenceDTO[];

  /** Budget */
  readonly budget?: number;

  /** Verbrauchtes Budget */
  readonly budgetUsed: number;

  /** Budget-Aufschlüsselung */
  readonly budgetBreakdown?: BudgetBreakdownDTO[];

  /** Ist vertraulich? */
  readonly isConfidential: boolean;

  /** Alle Aufgaben */
  readonly tasks: TaskDTO[];

  /** Kommentare */
  readonly comments: CommentDTO[];

  /** Audit Log (nur für Berechtigte) */
  readonly auditLog?: AuditLogEntryDTO[];

  /** Metadaten */
  readonly metadata: EventMetadataDTO;

  /** Benutzer-Berechtigungen */
  readonly permissions: EventPermissionsDTO;
};

/**
 * Public Participant DTO
 */
export type PublicParticipantDTO = {
  readonly id: string;
  readonly name: string;
  readonly avatarUrl?: string;
  readonly registeredAt: string;
};

/**
 * Event Media DTO
 */
export type EventMediaDTO = {
  readonly id: string;
  readonly type: "image" | "video";
  readonly url: string;
  readonly thumbnailUrl?: string;
  readonly caption?: string;
  readonly uploadedAt: string;
  readonly uploadedBy?: MemberReferenceDTO;
};

/**
 * Public Task DTO
 */
export type PublicTaskDTO = {
  readonly id: string;
  readonly title: string;
  readonly description?: string;
  readonly status: "offen" | "in_bearbeitung" | "erledigt";
  readonly priority: "niedrig" | "mittel" | "hoch" | "kritisch";
  readonly deadline?: string;
  readonly assignedTo?: string[]; // Nur Namen, keine IDs
};

/**
 * Internal Task DTO
 */
export type TaskDTO = PublicTaskDTO & {
  readonly assignees: MemberReferenceDTO[];
  readonly responsible?: MemberReferenceDTO;
  readonly materials?: MaterialDTO[];
  readonly dependencies?: string[];
  readonly createdAt: string;
  readonly completedAt?: string;
};

/**
 * Material DTO
 */
export type MaterialDTO = {
  readonly name: string;
  readonly quantity: number;
  readonly unit: string;
  readonly acquired: boolean;
  readonly description?: string;
};

/**
 * Comment DTO
 */
export type CommentDTO = {
  readonly id: string;
  readonly text: string;
  readonly author: MemberReferenceDTO;
  readonly createdAt: string;
  readonly mentions?: MemberReferenceDTO[];
  readonly isInternal: boolean;
};

/**
 * Budget Breakdown DTO
 */
export type BudgetBreakdownDTO = {
  readonly category: string;
  readonly amount: number;
  readonly description?: string;
  readonly receipts?: string[];
  readonly approvedBy?: MemberReferenceDTO;
};

/**
 * Audit Log Entry DTO
 */
export type AuditLogEntryDTO = {
  readonly action: string;
  readonly field?: string;
  readonly oldValue?: string;
  readonly newValue?: string;
  readonly changedBy: MemberReferenceDTO;
  readonly changedAt: string;
  readonly comment?: string;
};

/**
 * Event Metadata DTO
 */
export type EventMetadataDTO = {
  readonly createdBy: MemberReferenceDTO;
  readonly createdAt: string;
  readonly updatedBy?: MemberReferenceDTO;
  readonly updatedAt: string;
  readonly approvedBy?: MemberReferenceDTO;
  readonly approvedAt?: string;
  readonly cancelledBy?: MemberReferenceDTO;
  readonly cancelledAt?: string;
};

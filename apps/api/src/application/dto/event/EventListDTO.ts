// apps/api/src/application/dto/event/EventListDTO.ts

/**
 * Public Event List DTO
 * @description Öffentlich sichtbare Event-Informationen für Listen
 */
export type PublicEventListDTO = {
  /** Event ID */
  readonly id: string;

  /** Event Titel */
  readonly title: string;

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

  /** Sportbereich (optional) */
  readonly sportBereich?: SportBereichDTO;

  /** Maximale Teilnehmerzahl */
  readonly maxParticipants?: number;

  /** Aktuelle Teilnehmerzahl */
  readonly participantCount: number;

  /** Anmeldeschluss (ISO 8601) */
  readonly registrationDeadline?: string;

  /** Externe Ticket-URL */
  readonly ticketLink?: string;

  /** Ist Anmeldung möglich? */
  readonly canRegister: boolean;

  /** Cover-Bild URL */
  readonly coverImageUrl?: string;
};

/**
 * Internal Event List DTO
 * @description Erweiterte Event-Informationen für interne Nutzer
 */
export type InternalEventListDTO = PublicEventListDTO & {
  /** Event Status */
  readonly status: EventStatusDTO;

  /** Verantwortliche Person */
  readonly responsibleMember: MemberReferenceDTO;

  /** Stellvertreter */
  readonly deputyMembers?: MemberReferenceDTO[];

  /** Budget (nur für berechtigte Nutzer) */
  readonly budget?: number;

  /** Verbrauchtes Budget */
  readonly budgetUsed?: number;

  /** Aufgaben-Statistik */
  readonly taskStats: {
    readonly total: number;
    readonly completed: number;
    readonly overdue: number;
  };

  /** Ist vertraulich? */
  readonly isConfidential: boolean;

  /** Ersteller */
  readonly createdBy: MemberReferenceDTO;

  /** Erstellungsdatum (ISO 8601) */
  readonly createdAt: string;

  /** Letztes Update (ISO 8601) */
  readonly updatedAt: string;

  /** Benutzer-Berechtigungen für dieses Event */
  readonly permissions: EventPermissionsDTO;
};

/**
 * Event Location DTO
 */
export type EventLocationDTO = {
  /** Ortsname */
  readonly name: string;

  /** Adresse (optional) */
  readonly address?: string;

  /** Zusätzliche Beschreibung */
  readonly description?: string;

  /** Google Maps Link */
  readonly mapsUrl?: string;
};

/**
 * Member Reference DTO
 * @description Minimale Mitglieder-Info für Referenzen
 */
export type MemberReferenceDTO = {
  /** Member ID */
  readonly id: string;

  /** Vollständiger Name */
  readonly name: string;

  /** Profilbild URL */
  readonly avatarUrl?: string;

  /** Primäre Rolle */
  readonly role?: string;
};

/**
 * Event Permissions DTO
 * @description Was darf der aktuelle Nutzer mit diesem Event?
 */
export type EventPermissionsDTO = {
  readonly canEdit: boolean;
  readonly canDelete: boolean;
  readonly canChangeStatus: boolean;
  readonly canManageTasks: boolean;
  readonly canManageParticipants: boolean;
  readonly canViewBudget: boolean;
  readonly canEditBudget: boolean;
  readonly canApprove: boolean;
};

/**
 * Event Type DTO
 */
export type EventTypeDTO =
  | "vereinstreffen"
  | "sportveranstaltung"
  | "fanfahrt"
  | "social"
  | "sitzung"
  | "workshop"
  | "turnier"
  | "sonstiges";

/**
 * Sport Bereich DTO
 */
export type SportBereichDTO =
  | "league_of_legends"
  | "fussball"
  | "esports_allgemein"
  | "sonstiges";

/**
 * Event Status DTO
 */
export type EventStatusDTO =
  | "entwurf"
  | "geplant"
  | "genehmigt"
  | "aktiv"
  | "abgeschlossen"
  | "abgesagt";

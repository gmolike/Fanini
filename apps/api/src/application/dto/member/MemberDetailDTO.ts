// apps/api/src/application/dto/member/MemberDetailDTO.ts

import { MemberPermissionsDTO } from "./MemberListDTO";

/**
 * Public Member Detail DTO
 * @description Öffentlich sichtbare detaillierte Mitglieder-Informationen
 */
export type PublicMemberDetailDTO = {
  /** Member ID */
  readonly id: string;

  /** Vollständiger Name */
  readonly name: string;

  /** Mitglied seit (ISO 8601) */
  readonly memberSince: string;

  /** Profilbild URL */
  readonly avatarUrl?: string;

  /** Ausführliche Beschreibung */
  readonly description?: string;

  /** Öffentlich sichtbare Events */
  readonly publicEvents?: PublicEventReferenceDTO[];

  /** Creator-Profil (falls vorhanden und aktiv) */
  readonly creatorProfile?: PublicCreatorProfileDTO;

  /** Öffentliche Rollen */
  readonly publicRoles?: string[];
};

/**
 * Internal Member Detail DTO
 * @description Vollständige Mitglieder-Details für interne Nutzer
 */
export type InternalMemberDetailDTO = PublicMemberDetailDTO & {
  /** E-Mail (permission-basiert) */
  readonly email?: string;

  /** Telefon (permission-basiert) */
  readonly phone?: string;

  /** Adresse (hochsensitiv) */
  readonly address?: AddressDTO;

  /** Geburtsdatum (hochsensitiv) */
  readonly birthdate?: string;

  /** Mitgliedsnummer */
  readonly memberNumber?: string;

  /** Alle Rollen mit Details */
  readonly roles: RoleDTO[];

  /** Zugewiesene Aufgaben */
  readonly assignedTasks: TaskReferenceDTO[];

  /** Event-Teilnahmen */
  readonly eventParticipations: EventParticipationDTO[];

  /** Kontakt-Präferenzen */
  readonly contactPreferences?: ContactPreferencesDTO;

  /** Sichtbarkeitseinstellungen */
  readonly visibilitySettings: VisibilitySettingsDTO;

  /** Benutzer-Berechtigungen */
  readonly permissions: MemberPermissionsDTO;

  /** Metadaten */
  readonly metadata: MemberMetadataDTO;

  /** Audit Log (nur Vorstand) */
  readonly auditLog?: AuditLogEntryDTO[];
};

/**
 * Address DTO
 */
export type AddressDTO = {
  readonly street: string;
  readonly houseNumber: string;
  readonly zipCode: string;
  readonly city: string;
  readonly country?: string;
};

/**
 * Contact Preferences DTO
 */
export type ContactPreferencesDTO = {
  readonly preferredChannel: "email" | "phone" | "both";
  readonly newsletterSubscribed: boolean;
  readonly eventReminders: boolean;
  readonly taskNotifications: boolean;
};

/**
 * Visibility Settings DTO
 */
export type VisibilitySettingsDTO = {
  readonly emailVisibility: "private" | "team" | "members" | "public";
  readonly phoneVisibility: "private" | "team" | "members" | "public";
  readonly addressVisibility: "private" | "team" | "members" | "public";
  readonly profileVisibility: "private" | "team" | "members" | "public";
};

/**
 * Member Metadata DTO
 */
export type MemberMetadataDTO = {
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly lastLogin?: string;
  readonly loginCount: number;
  readonly isActive: boolean;
  readonly hasConfidentialityAgreement: boolean;
  readonly authSource: "local" | "easyverein";
};

/**
 * Helper Types
 */
export type PublicEventReferenceDTO = {
  readonly id: string;
  readonly title: string;
  readonly date: string;
  readonly role: "responsible" | "deputy" | "participant";
};

export type PublicCreatorProfileDTO = {
  readonly id: string;
  readonly artistName: string;
  readonly types: string[];
  readonly portfolioUrl?: string;
  readonly workCount: number;
};

export type TaskReferenceDTO = {
  readonly id: string;
  readonly title: string;
  readonly status: string;
  readonly priority: string;
  readonly deadline?: string;
};

export type EventParticipationDTO = {
  readonly eventId: string;
  readonly eventTitle: string;
  readonly date: string;
  readonly status: "registered" | "attended" | "cancelled";
  readonly registeredAt: string;
};

export type RoleDTO = {
  readonly id: string;
  readonly name: string;
  readonly displayName: string;
  readonly assignedAt: string;
  readonly assignedBy?: string;
};

export type AuditLogEntryDTO = {
  readonly action: string;
  readonly field?: string;
  readonly oldValue?: string;
  readonly newValue?: string;
  readonly changedBy: string;
  readonly changedByName?: string;
  readonly changedAt: string;
  readonly ipAddress?: string;
};

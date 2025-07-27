// apps/api/src/application/dto/member/CreateMemberDTO.ts

import { AddressDTO, ContactPreferencesDTO, VisibilitySettingsDTO } from "./MemberDetailDTO";

/**
 * Create Member DTO
 * @description Daten für Mitglieder-Erstellung
 */
export type CreateMemberDTO = {
  /** Vorname (max 50 Zeichen) */
  readonly firstName: string;

  /** Nachname (max 50 Zeichen) */
  readonly lastName: string;

  /** E-Mail (unique) */
  readonly email: string;

  /** Telefon (optional) */
  readonly phone?: string;

  /** Mitglieder-Typ */
  readonly memberType: "easyverein" | "creator" | "sponsor" | "partner";

  /** Passwort-Option (nur für lokale Mitglieder) */
  readonly passwordOption?: "none" | "generate" | "manual";

  /** Manuelles Passwort (wenn passwordOption = manual) */
  readonly password?: string;

  /** Creator-spezifische Daten */
  readonly creatorData?: CreateCreatorDataDTO;

  /** Initiale Rolle */
  readonly initialRole?: string;
};

/**
 * Create Creator Data DTO
 */
export type CreateCreatorDataDTO = {
  /** Künstlername */
  readonly artistName: string;

  /** Portfolio URL */
  readonly portfolioUrl?: string;

  /** Creator-Typen */
  readonly types: string[];

  /** Beschreibung */
  readonly description?: string;
};

/**
 * Update Member DTO
 * @description Daten für Mitglieder-Aktualisierung
 */
export type UpdateMemberDTO = {
  /** Vorname */
  readonly firstName?: string;

  /** Nachname */
  readonly lastName?: string;

  /** E-Mail */
  readonly email?: string;

  /** Telefon */
  readonly phone?: string;

  /** Adresse */
  readonly address?: AddressDTO;

  /** Geburtsdatum */
  readonly birthdate?: string;

  /** Beschreibung */
  readonly description?: string;

  /** Profilbild URL */
  readonly avatarUrl?: string;

  /** Kontakt-Präferenzen */
  readonly contactPreferences?: ContactPreferencesDTO;

  /** Sichtbarkeitseinstellungen */
  readonly visibilitySettings?: VisibilitySettingsDTO;

  /** Ist aktiv? (nur Admin/Vorstand) */
  readonly isActive?: boolean;

  /** Änderungskommentar */
  readonly changeComment?: string;
};

/**
 * Validation Rules für Member Creation
 */
export const CREATE_MEMBER_VALIDATION = {
  firstName: {
    minLength: 2,
    maxLength: 50,
    required: true,
  },
  lastName: {
    minLength: 2,
    maxLength: 50,
    required: true,
  },
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    required: true,
  },
  phone: {
    pattern: /^[\d\s\-\+\(\)]+$/,
    minLength: 6,
    maxLength: 20,
    required: false,
  },
} as const;

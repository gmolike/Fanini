// apps/api/src/domain/entities/User.ts

/**
 * User Entity
 * @description Repräsentiert einen authentifizierten Benutzer
 */
export type User = {
  /** Eindeutige ID */
  id: string;
  /** E-Mail-Adresse (unique) */
  email: string;
  /** Vorname */
  vorname: string;
  /** Nachname */
  nachname: string;
  /** Mitgliedsnummer (optional) */
  mitgliedsnummer?: string;
  /** Auth-Quelle (local oder easyverein) */
  authSource: "local" | "easyverein";
  /** EasyVerein ID (optional) */
  easyVereinId?: string;
  /** Passwort-Hash (nur für lokale User) */
  passwordHash?: string;
  /** Aktiv-Status */
  istAktiv: boolean;
  /** Erstellungsdatum */
  erstelltAm: Date;
  /** Aktualisierungsdatum */
  aktualisiertAm: Date;
  /** Letzter Login (optional) */
  letzterLogin?: Date;
};

/**
 * User Role Entity
 * @description Repräsentiert eine Benutzerrolle mit Berechtigungen
 */
export type UserRole = {
  /** Rollen-ID */
  id: string;
  /** Rollenname */
  name: RoleName;
  /** Liste der Berechtigungen */
  berechtigungen: string[];
};

/**
 * Verfügbare Rollennamen
 */
export type RoleName =
  | "ADMIN"
  | "VORSTAND"
  | "BEIRAT"
  | "TEAM_EVENT"
  | "TEAM_MEDIEN"
  | "TEAM_TECHNIK"
  | "TEAM_VEREIN"
  | "MITGLIED";

// apps/api/src/domain/entities/User.ts
export type User = {
  id: string;
  email: string;
  vorname: string;
  nachname: string;
  mitgliedsnummer?: string;
  authSource: "local" | "easyverein";
  easyVereinId?: string;
  passwordHash?: string;
  istAktiv: boolean;
  erstelltAm: Date;
  aktualisiertAm: Date;
  letzterLogin?: Date;
};

export type UserRole = {
  id: string;
  name: RoleName;
  berechtigungen: string[]; // Direkt string[], kein Type Alias
};

export type RoleName =
  | "ADMIN"
  | "VORSTAND"
  | "BEIRAT"
  | "TEAM_EVENT"
  | "TEAM_MEDIEN"
  | "TEAM_TECHNIK"
  | "TEAM_VEREIN"
  | "MITGLIED";


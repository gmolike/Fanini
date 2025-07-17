// apps/web/src/features/auth/model/types.ts
export type LoginCredentials = {
  email: string;
  password: string;
};

export type AuthResponse = {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
};

export type AuthUser = {
  id: string;
  easyVereinId: string;
  email: string;
  vorname: string;
  nachname: string;
  mitgliedsnummer?: string;
  rollen: UserRole[];
};

export type UserRole = {
  id: string;
  name: RoleName;
  berechtigungen: string[]; // Direkt string[] statt Permission[]
};

export type RoleName =
  | 'ADMIN'
  | 'VORSTAND'
  | 'BEIRAT'
  | 'TEAM_EVENT'
  | 'TEAM_MEDIEN'
  | 'TEAM_TECHNIK'
  | 'TEAM_VEREIN'
  | 'MITGLIED';

// Permission Type Alias ENTFERNEN!

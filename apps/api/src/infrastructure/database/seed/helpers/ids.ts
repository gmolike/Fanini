// seed/helpers/ids.ts
export const PREDEFINED_IDS = {
  // Users
  admin: 'usr_admin_00000000',
  vorstand1: 'usr_vorstand_001',
  vorstand2: 'usr_vorstand_002',
  beirat1: 'usr_beirat_00001',
  beirat2: 'usr_beirat_00002',
  teamEvent1: 'usr_team_event_1',
  teamEvent2: 'usr_team_event_2',
  teamMedien1: 'usr_team_med_01',
  teamTechnik1: 'usr_team_tech_1',
  teamVerein1: 'usr_team_ver_01',

  // Roles
  roleAdmin: 'role_admin',
  roleVorstand: 'role_vorstand',
  roleBeirat: 'role_beirat',
  roleTeamEvent: 'role_team_event',
  roleTeamMedien: 'role_team_medien',
  roleTeamTechnik: 'role_team_technik',
  roleTeamVerein: 'role_team_verein',
  roleMitglied: 'role_mitglied',

  // Standard Events
  monatstreffen: 'evt_monatstreffen',
  jahreshauptversammlung: 'evt_jhv_2025',
} as const;

export const generateId = (prefix: string): string => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 9);
  return `${prefix}_${timestamp}_${random}`;
};

// apps/api/src/infrastructure/database/seed/data/roles.ts
export const roleData = [
  {
    id: "role_admin",
    name: "ADMIN",
    beschreibung: "Systemadministrator mit vollständigen Rechten",
    hierarchie_ebene: 1,
  },
  {
    id: "role_vorstand",
    name: "VORSTAND",
    beschreibung: "Vorstandsmitglied",
    hierarchie_ebene: 2,
  },
  {
    id: "role_beirat",
    name: "BEIRAT",
    beschreibung: "Beiratsmitglied",
    hierarchie_ebene: 3,
  },
  {
    id: "role_team_event",
    name: "TEAM_EVENT",
    beschreibung: "Team Event - Veranstaltungsorganisation",
    hierarchie_ebene: 4,
  },
  {
    id: "role_team_medien",
    name: "TEAM_MEDIEN",
    beschreibung: "Team Medien - Social Media und Content",
    hierarchie_ebene: 4,
  },
  {
    id: "role_team_technik",
    name: "TEAM_TECHNIK",
    beschreibung: "Team Technik - IT und Website",
    hierarchie_ebene: 4,
  },
  {
    id: "role_team_verein",
    name: "TEAM_VEREIN",
    beschreibung: "Team Verein - Verwaltung",
    hierarchie_ebene: 4,
  },
  {
    id: "role_mitglied",
    name: "MITGLIED",
    beschreibung: "Normales Vereinsmitglied",
    hierarchie_ebene: 5,
  },
];

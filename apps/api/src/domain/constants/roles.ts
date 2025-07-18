// apps/api/src/domain/constants/roles.ts

/**
 * Verfügbare Rollen im System
 */
export const ROLES = {
  ADMIN: "ADMIN",
  VORSTAND: "VORSTAND",
  BEIRAT: "BEIRAT",
  KASSENPRUFER: "KASSENPRUFER",
  TEAM_EVENT: "TEAM_EVENT",
  TEAM_MEDIEN: "TEAM_MEDIEN",
  TEAM_TECHNIK: "TEAM_TECHNIK",
  TEAM_VEREIN: "TEAM_VEREIN",
  MITGLIED: "MITGLIED",
} as const;

export type RoleName = keyof typeof ROLES;

/**
 * Role Metadata
 */
export const roleMetadata: Record<
  RoleName,
  {
    name: string;
    description: string;
    color: string;
    icon: string;
  }
> = {
  ADMIN: {
    name: "Administrator",
    description: "Vollzugriff auf alle Systembereiche",
    color: "#DC2626", // red-600
    icon: "Shield",
  },
  VORSTAND: {
    name: "Vorstand",
    description: "Vereinsvorstand mit erweiterten Rechten",
    color: "#7C3AED", // violet-600
    icon: "Crown",
  },
  BEIRAT: {
    name: "Beirat",
    description: "Beiratsmitglied mit Genehmigungsrechten",
    color: "#2563EB", // blue-600
    icon: "Users",
  },
  KASSENPRUFER: {
    name: "Kassenprüfer",
    description: "Zugriff auf Finanzdaten zur Prüfung",
    color: "#059669", // emerald-600
    icon: "Calculator",
  },
  TEAM_EVENT: {
    name: "Team Event",
    description: "Verantwortlich für Veranstaltungen",
    color: "#EA580C", // orange-600
    icon: "Calendar",
  },
  TEAM_MEDIEN: {
    name: "Team Medien",
    description: "Verantwortlich für Medien und Content",
    color: "#E11D48", // rose-600
    icon: "Camera",
  },
  TEAM_TECHNIK: {
    name: "Team Technik",
    description: "Verantwortlich für technische Systeme",
    color: "#0891B2", // cyan-600
    icon: "Cpu",
  },
  TEAM_VEREIN: {
    name: "Team Verein",
    description: "Allgemeine Vereinsverwaltung",
    color: "#65A30D", // lime-600
    icon: "Home",
  },
  MITGLIED: {
    name: "Mitglied",
    description: "Reguläres Vereinsmitglied",
    color: "#6B7280", // gray-500
    icon: "User",
  },
};

/**
 * Permission Groups
 */
export const PERMISSION_GROUPS = {
  MEMBERS: "pg_members",
  EVENTS: "pg_events",
  FINANCE: "pg_finance",
  CONTENT: "pg_content",
  SYSTEM: "pg_system",
} as const;

/**
 * Standard Permissions pro Rolle
 */
export const rolePermissions: Record<RoleName, string[]> = {
  ADMIN: ["*.*"], // Wildcard für alle Permissions

  VORSTAND: [
    "member.view_basic",
    "member.view_contact",
    "member.view_sensitive",
    "member.edit_all",
    "member.assign_role",
    "event.approve",
    "finance.view",
    "finance.approve",
  ],

  BEIRAT: [
    "member.view_basic",
    "member.view_contact",
    "event.approve",
    "finance.view",
  ],

  KASSENPRUFER: ["member.view_basic", "finance.view", "finance.export"],

  TEAM_EVENT: ["member.view_basic", "event.create", "event.edit_own"],

  TEAM_MEDIEN: ["member.view_basic", "content.create", "content.edit_own"],

  TEAM_TECHNIK: [
    "member.view_basic",
    "member.view_contact",
    "system.view_logs",
  ],

  TEAM_VEREIN: ["member.view_basic", "member.view_contact"],

  MITGLIED: ["member.view_basic", "member.edit_own"],
};

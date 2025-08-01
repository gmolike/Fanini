// apps/api/src/domain/entities/Rolle.ts

import { generateId } from "@faninitiative/shared";

/**
 * Definiert die verfügbaren Rollen im System
 */
export type RollenTyp =
  | "ADMIN"
  | "VORSTAND"
  | "BEIRAT"
  | "KASSENPRUFER"
  | "TEAM_EVENT"
  | "TEAM_TECHNIK"
  | "TEAM_MEDIEN"
  | "TEAM_VEREIN"
  | "MITGLIED";

/**
 * Definiert die Berechtigungsebenen
 */
export type BerechtigungEbene =
  | "system" // Admin
  | "verein" // Vorstand
  | "bereich" // Teams
  | "basis"; // Mitglied

/**
 * Rolle Entity
 * @description Definiert Rollen und deren Berechtigungen im System
 */
export type Rolle = {
  readonly id: string;
  readonly name: RollenTyp;
  readonly bezeichnung: string;
  readonly beschreibung: string;
  readonly hierarchieEbene: number;
  readonly berechtigungEbene: BerechtigungEbene;
  readonly istSystemRolle: boolean;
  readonly kannRollenZuweisen: boolean;
  readonly maxMitglieder?: number;
  readonly istAktiv: boolean;
  readonly erstelltAm: Date;
  readonly aktualisiertAm: Date;
};

/**
 * Erstellt eine neue Rolle
 */
export const createRolle = (params: {
  name: RollenTyp;
  bezeichnung: string;
  beschreibung: string;
  hierarchieEbene: number;
  berechtigungEbene: BerechtigungEbene;
  istSystemRolle?: boolean;
  kannRollenZuweisen?: boolean;
  maxMitglieder?: number;
}): Rolle => {
  const now = new Date();
  return {
    id: generateId(),
    name: params.name,
    bezeichnung: params.bezeichnung,
    beschreibung: params.beschreibung,
    hierarchieEbene: params.hierarchieEbene,
    berechtigungEbene: params.berechtigungEbene,
    istSystemRolle: params.istSystemRolle ?? true,
    kannRollenZuweisen: params.kannRollenZuweisen ?? false,
    maxMitglieder: params.maxMitglieder,
    istAktiv: true,
    erstelltAm: now,
    aktualisiertAm: now,
  };
};

/**
 * Prüft ob eine Rolle eine andere zuweisen darf
 */
export const kannRolleZuweisen = (
  zuweisenderRolle: Rolle,
  zuzuweisendeRolle: Rolle,
): boolean => {
  // Admin darf alles
  if (zuweisenderRolle.name === "ADMIN") return true;

  // Kann überhaupt Rollen zuweisen?
  if (!zuweisenderRolle.kannRollenZuweisen) return false;

  // Hierarchie-Check: nur niedrigere oder gleiche Ebene
  return zuweisenderRolle.hierarchieEbene <= zuzuweisendeRolle.hierarchieEbene;
};

/**
 * Standard-Rollen für das System
 */
export const STANDARD_ROLLEN: Omit<
  Rolle,
  "id" | "erstelltAm" | "aktualisiertAm"
>[] = [
  {
    name: "ADMIN",
    bezeichnung: "Administrator",
    beschreibung: "Vollzugriff auf alle Systemfunktionen",
    hierarchieEbene: 0,
    berechtigungEbene: "system",
    istSystemRolle: true,
    kannRollenZuweisen: true,
    maxMitglieder: undefined,
    istAktiv: true,
  },
  {
    name: "VORSTAND",
    bezeichnung: "Vorstand",
    beschreibung: "Vereinsvorstand mit erweiterten Rechten",
    hierarchieEbene: 1,
    berechtigungEbene: "verein",
    istSystemRolle: true,
    kannRollenZuweisen: true,
    maxMitglieder: 10,
    istAktiv: true,
  },
  {
    name: "BEIRAT",
    bezeichnung: "Beirat",
    beschreibung: "Beiratsmitglied mit Genehmigungsrechten",
    hierarchieEbene: 2,
    berechtigungEbene: "verein",
    istSystemRolle: true,
    kannRollenZuweisen: true,
    maxMitglieder: 20,
    istAktiv: true,
  },
  {
    name: "KASSENPRUFER",
    bezeichnung: "Kassenprüfer",
    beschreibung: "Prüfung und Einsicht in Finanzen",
    hierarchieEbene: 3,
    berechtigungEbene: "verein",
    istSystemRolle: true,
    kannRollenZuweisen: false,
    maxMitglieder: 4,
    istAktiv: true,
  },
  {
    name: "TEAM_EVENT",
    bezeichnung: "Team Event",
    beschreibung: "Verantwortlich für Event-Organisation",
    hierarchieEbene: 4,
    berechtigungEbene: "bereich",
    istSystemRolle: true,
    kannRollenZuweisen: false,
    maxMitglieder: undefined,
    istAktiv: true,
  },
  {
    name: "TEAM_TECHNIK",
    bezeichnung: "Team Technik",
    beschreibung: "Technische Betreuung und Support",
    hierarchieEbene: 4,
    berechtigungEbene: "bereich",
    istSystemRolle: true,
    kannRollenZuweisen: false,
    maxMitglieder: undefined,
    istAktiv: true,
  },
  {
    name: "TEAM_MEDIEN",
    bezeichnung: "Team Medien",
    beschreibung: "Social Media und Content-Verwaltung",
    hierarchieEbene: 4,
    berechtigungEbene: "bereich",
    istSystemRolle: true,
    kannRollenZuweisen: false,
    maxMitglieder: undefined,
    istAktiv: true,
  },
  {
    name: "TEAM_VEREIN",
    bezeichnung: "Team Verein",
    beschreibung: "Allgemeine Vereinsverwaltung",
    hierarchieEbene: 4,
    berechtigungEbene: "bereich",
    istSystemRolle: true,
    kannRollenZuweisen: false,
    maxMitglieder: undefined,
    istAktiv: true,
  },
  {
    name: "MITGLIED",
    bezeichnung: "Mitglied",
    beschreibung: "Basis-Mitgliedschaft im Verein",
    hierarchieEbene: 5,
    berechtigungEbene: "basis",
    istSystemRolle: true,
    kannRollenZuweisen: false,
    maxMitglieder: undefined,
    istAktiv: true,
  },
];

/**
 * Prüft ob eine Rolle höhere Rechte hat
 */
export const hatHoehereRechte = (rolle1: Rolle, rolle2: Rolle): boolean => {
  return rolle1.hierarchieEbene < rolle2.hierarchieEbene;
};

/**
 * Gibt die höchste Rolle aus einer Liste zurück
 */
export const getHoechsteRolle = (rollen: Rolle[]): Rolle | undefined => {
  if (rollen.length === 0) return undefined;

  return rollen.reduce((hoechste, aktuelle) =>
    aktuelle.hierarchieEbene < hoechste.hierarchieEbene ? aktuelle : hoechste,
  );
};

/**
 * Prüft ob Rolle ein Team ist
 */
export const istTeamRolle = (rolle: Rolle): boolean => {
  const teamRollen: RollenTyp[] = [
    "TEAM_EVENT",
    "TEAM_TECHNIK",
    "TEAM_MEDIEN",
    "TEAM_VEREIN",
  ];
  return teamRollen.includes(rolle.name);
};

/**
 * Prüft ob Rolle administrative Rechte hat
 */
export const hatAdminRechte = (rolle: Rolle): boolean => {
  return (
    rolle.berechtigungEbene === "system" || rolle.berechtigungEbene === "verein"
  );
};

/**
 * Serialisiert Rolle für JSON
 */
export const rolleToJSON = (rolle: Rolle) => ({
  id: rolle.id,
  name: rolle.name,
  bezeichnung: rolle.bezeichnung,
  beschreibung: rolle.beschreibung,
  hierarchieEbene: rolle.hierarchieEbene,
  berechtigungEbene: rolle.berechtigungEbene,
  istSystemRolle: rolle.istSystemRolle,
  kannRollenZuweisen: rolle.kannRollenZuweisen,
  maxMitglieder: rolle.maxMitglieder,
  istAktiv: rolle.istAktiv,
  erstelltAm: rolle.erstelltAm.toISOString(),
  aktualisiertAm: rolle.aktualisiertAm.toISOString(),
});

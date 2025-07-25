// packages/shared/src/constants/labels.ts
import type {
  RoleName,
  EventStatus,
  EventType,
  TaskStatus,
  TaskPriority,
} from "../types";

/**
 * Role display labels
 * @description Human-readable labels for role types
 */
export const ROLE_LABELS: Record<RoleName, string> = {
  ADMIN: "Administrator",
  VORSTAND: "Vorstand",
  BEIRAT: "Beirat",
  KASSENPRUFER: "Kassenprüfer",
  TEAM_EVENT: "Team Event",
  TEAM_TECHNIK: "Team Technik",
  TEAM_MEDIEN: "Team Medien",
  TEAM_VEREIN: "Team Verein",
  MITGLIED: "Mitglied",
} as const;

/**
 * Event status display labels
 * @description Human-readable labels for event statuses
 */
export const EVENT_STATUS_LABELS: Record<EventStatus, string> = {
  entwurf: "Entwurf",
  geplant: "Geplant",
  genehmigt: "Genehmigt",
  aktiv: "Aktiv",
  abgeschlossen: "Abgeschlossen",
  abgesagt: "Abgesagt",
} as const;

/**
 * Event type display labels
 * @description Human-readable labels for event types
 */
export const EVENT_TYPE_LABELS: Record<EventType, string> = {
  vereinstreffen: "Vereinstreffen",
  sportveranstaltung: "Sportveranstaltung",
  fanfahrt: "Fanfahrt",
  social: "Social Event",
  sitzung: "Sitzung",
  workshop: "Workshop",
  turnier: "Turnier",
  sonstiges: "Sonstiges",
} as const;

/**
 * Task status display labels
 * @description Human-readable labels for task statuses
 */
export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  offen: "Offen",
  in_bearbeitung: "In Bearbeitung",
  review: "Review",
  erledigt: "Erledigt",
  blockiert: "Blockiert",
} as const;

/**
 * Task priority display labels
 * @description Human-readable labels for task priorities
 */
export const TASK_PRIORITY_LABELS: Record<TaskPriority, string> = {
  niedrig: "Niedrig",
  mittel: "Mittel",
  hoch: "Hoch",
  kritisch: "Kritisch",
} as const;

// apps/api/src/application/use-cases/task/helpers/permissions.ts
import type { Task } from "@/domain/entities/Task";

/**
 * Prüft ob ein Benutzer den Task-Status ändern darf
 */
export const canChangeTaskStatus = (
  task: Task,
  userId: string,
  userRole: string
): boolean => {
  if (["ADMIN", "VORSTAND", "BEIRAT"].includes(userRole)) return true;

  if (task.context.type === "event" && userRole === "TEAM_EVENT") return true;

  return task.verantwortlichId === userId ||
         (task.zugewiesenAn.includes(userId) &&
          ["offen", "in_bearbeitung"].includes(task.status));
};

/**
 * Prüft ob ein Benutzer eine Task bearbeiten darf
 */
export const canEditTask = (
  task: Task,
  userId: string,
  userRole: string
): boolean => {
  if (["ADMIN", "VORSTAND", "BEIRAT"].includes(userRole)) return true;

  return task.verantwortlichId === userId ||
         task.erstelltVon === userId ||
         task.zugewiesenAn.includes(userId);
};

/**
 * Prüft ob ein Benutzer eine Task löschen darf
 */
export const canDeleteTask = (
  task: Task,
  userId: string,
  userRole: string
): boolean => {
  if (userRole === "ADMIN") return true;

  return task.erstelltVon === userId && task.status === "offen";
};

/**
 * Prüft ob ein Benutzer Tasks zuweisen darf
 */
export const canAssignTask = (
  task: Task,
  userId: string,
  userRole: string
): boolean => {
  if (["ADMIN", "VORSTAND", "BEIRAT"].includes(userRole)) return true;

  return task.verantwortlichId === userId;
};

/**
 * Prüft ob ein Benutzer eine Task ansehen darf
 */
export const canViewTask = (
  task: Task,
  userId: string,
  userRole: string
): boolean => {
  if (["ADMIN", "VORSTAND", "BEIRAT"].includes(userRole)) return true;

  return task.verantwortlichId === userId ||
         task.zugewiesenAn.includes(userId) ||
         task.erstelltVon === userId;
};

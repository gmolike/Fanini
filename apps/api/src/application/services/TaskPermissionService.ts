// apps/api/src/application/services/TaskPermissionService.ts
import type { Task } from "@/domain/entities/Task";

/**
 * Service für Task-spezifische Berechtigungen
 */
export type TaskPermissionService = {
  canCreateTask: (userRole: string, contextType: string) => boolean;
  canEditTask: (task: Task, userId: string, userRole: string) => boolean;
  canDeleteTask: (task: Task, userId: string, userRole: string) => boolean;
  canChangeStatus: (task: Task, userId: string, userRole: string, newStatus: string) => boolean;
  canAssignTask: (task: Task, userId: string, userRole: string) => boolean;
  canViewTask: (task: Task, userId: string, userRole: string) => boolean;
};

/**
 * Factory für TaskPermissionService
 */
export const createTaskPermissionService = (): TaskPermissionService => ({
  canCreateTask: (userRole, contextType) => {
    const permissions: Record<string, ReadonlyArray<string>> = {
      event: ["ADMIN", "VORSTAND", "BEIRAT", "TEAM_EVENT"],
      team: ["ADMIN", "VORSTAND", "BEIRAT", "TEAM_EVENT", "TEAM_MEDIEN", "TEAM_TECHNIK", "TEAM_VEREIN"],
      general: ["ADMIN", "VORSTAND", "BEIRAT"]
    };

    return permissions[contextType]?.includes(userRole) || false;
  },

  canEditTask: (task, userId, userRole) => {
    if (["ADMIN", "VORSTAND"].includes(userRole)) return true;
    if (userRole === "BEIRAT" && task.status !== "erledigt") return true;

    return task.verantwortlichId === userId ||
           task.zugewiesenAn.includes(userId) ||
           (task.erstelltVon === userId && task.status === "offen");
  },

  canDeleteTask: (task, userId, userRole) => {
    if (userRole === "ADMIN") return true;
    if (task.status !== "offen") return false;
    if (["VORSTAND", "BEIRAT"].includes(userRole)) return true;

    return task.erstelltVon === userId;
  },

  canChangeStatus: (task, userId, userRole, newStatus) => {
    if (userRole === "ADMIN") return true;

    if (newStatus === "erledigt") {
      return task.verantwortlichId === userId ||
             task.zugewiesenAn.includes(userId);
    }

    if (newStatus === "blockiert") {
      return ["VORSTAND", "BEIRAT"].includes(userRole) ||
             task.verantwortlichId === userId ||
             task.zugewiesenAn.includes(userId);
    }

    return task.verantwortlichId === userId ||
           task.zugewiesenAn.includes(userId) ||
           task.erstelltVon === userId;
  },

  canAssignTask: (task, userId, userRole) => {
    if (["ADMIN", "VORSTAND", "BEIRAT"].includes(userRole)) return true;

    return task.verantwortlichId === userId;
  },

  canViewTask: (task, userId, userRole) => {
    if (["ADMIN", "VORSTAND", "BEIRAT"].includes(userRole)) return true;

    return task.verantwortlichId === userId ||
           task.zugewiesenAn.includes(userId) ||
           task.erstelltVon === userId ||
           task.context.type === "general";
  }
});

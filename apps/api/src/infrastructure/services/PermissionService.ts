// apps/api/src/infrastructure/services/PermissionService.ts
import { IPermissionService } from "@/domain/services/IPermissionService";
import { Event, EventStatus } from "@/domain/entities/Event";
import { Task, TaskStatus } from "@/domain/entities/Task";

export class PermissionService implements IPermissionService {
  async canCreateEvent(userRole: string): Promise<boolean> {
    const allowedRoles = ["ADMIN", "VORSTAND", "BEIRAT", "TEAM_EVENT"];
    return allowedRoles.includes(userRole);
  }

  async canEditEvent(
    userRole: string,
    userId: string,
    event: Event,
  ): Promise<boolean> {
    // Admin und Vorstand können alles bearbeiten
    if (["ADMIN", "VORSTAND"].includes(userRole)) {
      return true;
    }

    // Beirat kann genehmigte Events eingeschränkt bearbeiten
    if (userRole === "BEIRAT") {
      return true;
    }

    // Team Event und Verantwortlicher können eigene Events bearbeiten
    if (
      userRole === "TEAM_EVENT" ||
      userId === event.createdBy ||
      userId === event.responsibleMemberId
    ) {
      // Aber nur im Status Entwurf oder Geplant
      return ["entwurf", "geplant"].includes(event.status);
    }

    return false;
  }

  async canDeleteEvent(
    userRole: string,
    userId: string,
    event: Event,
  ): Promise<boolean> {
    if (userRole === "ADMIN") {
      return true;
    }

    // Nur Entwürfe können gelöscht werden
    if (event.status !== "entwurf") {
      return false;
    }

    // Vorstand kann alle Entwürfe löschen
    if (userRole === "VORSTAND") {
      return true;
    }

    // Ersteller kann eigene Entwürfe löschen
    return userId === event.createdBy;
  }

  async canChangeEventStatus(
    userRole: string,
    userId: string,
    event: Event,
    newStatus: EventStatus,
  ): Promise<boolean> {
    // Admin kann alle Status-Änderungen durchführen
    if (userRole === "ADMIN") {
      return true;
    }

    // Genehmigung nur durch Beirat oder Vorstand
    if (newStatus === "genehmigt") {
      return ["VORSTAND", "BEIRAT"].includes(userRole);
    }

    // Aktivierung nur nach Genehmigung
    if (newStatus === "aktiv") {
      return (
        event.status === "genehmigt" &&
        (userRole === "VORSTAND" || userId === event.responsibleMemberId)
      );
    }

    // Abschluss nur durch Verantwortlichen oder Vorstand
    if (newStatus === "abgeschlossen") {
      return (
        event.status === "aktiv" &&
        (userRole === "VORSTAND" || userId === event.responsibleMemberId)
      );
    }

    // Absage durch Vorstand, Beirat oder Verantwortlichen
    if (newStatus === "abgesagt") {
      return (
        ["VORSTAND", "BEIRAT"].includes(userRole) ||
        userId === event.responsibleMemberId
      );
    }

    // Planung durch Ersteller oder Team Event
    if (newStatus === "geplant") {
      return (
        event.status === "entwurf" &&
        (userId === event.createdBy || userRole === "TEAM_EVENT")
      );
    }

    return false;
  }

  async canViewInternalEvent(
    userRole: string,
    userId: string,
    event: Event,
  ): Promise<boolean> {
    // Admin, Vorstand und Beirat sehen alles
    if (["ADMIN", "VORSTAND", "BEIRAT"].includes(userRole)) {
      return true;
    }

    // Öffentliche Events sehen alle Mitglieder
    if (event.isPublic) {
      return true;
    }

    // Verantwortliche und Stellvertreter sehen ihre Events
    if (
      userId === event.responsibleMemberId ||
      event.deputyMemberIds?.includes(userId)
    ) {
      return true;
    }

    // Team Event sieht eigene Events
    if (userRole === "TEAM_EVENT" && userId === event.createdBy) {
      return true;
    }

    return false;
  }
  // Task Permissions
  async canCreateTask(
    userRole: string,
    contextType: "event" | "team" | "general",
  ): Promise<boolean> {
    const permissions: Record<string, string[]> = {
      event: ["ADMIN", "VORSTAND", "BEIRAT", "TEAM_EVENT"],
      team: [
        "ADMIN",
        "VORSTAND",
        "BEIRAT",
        "TEAM_EVENT",
        "TEAM_MEDIEN",
        "TEAM_TECHNIK",
        "TEAM_VEREIN",
      ],
      general: ["ADMIN", "VORSTAND", "BEIRAT"],
    };

    return permissions[contextType]?.includes(userRole) || false;
  }

  async canEditTask(
    userRole: string,
    userId: string,
    task: Task,
  ): Promise<boolean> {
    // Admin und Vorstand können alles bearbeiten
    if (["ADMIN", "VORSTAND"].includes(userRole)) {
      return true;
    }

    // Beirat kann alle offenen Tasks bearbeiten
    if (userRole === "BEIRAT" && task.status !== "erledigt") {
      return true;
    }

    // Verantwortlicher und Zugewiesene können ihre Tasks bearbeiten
    if (
      task.verantwortlichId === userId ||
      task.zugewiesenAn.includes(userId)
    ) {
      return task.status !== "erledigt";
    }

    // Ersteller kann eigene Tasks bearbeiten wenn noch offen
    if (task.erstelltVon === userId && task.status === "offen") {
      return true;
    }

    return false;
  }

  async canDeleteTask(
    userRole: string,
    userId: string,
    task: Task,
  ): Promise<boolean> {
    if (userRole === "ADMIN") {
      return true;
    }

    // Nur offene Tasks können gelöscht werden
    if (task.status !== "offen") {
      return false;
    }

    // Vorstand und Beirat können alle offenen Tasks löschen
    if (["VORSTAND", "BEIRAT"].includes(userRole)) {
      return true;
    }

    // Ersteller kann eigene Tasks löschen
    return task.erstelltVon === userId;
  }

  async canChangeTaskStatus(
    userRole: string,
    userId: string,
    task: Task,
    newStatus: TaskStatus,
  ): Promise<boolean> {
    // Admin kann alle Status-Änderungen durchführen
    if (userRole === "ADMIN") {
      return true;
    }

    // Erledigung nur durch Zugewiesene oder Verantwortliche
    if (newStatus === "erledigt") {
      return (
        task.verantwortlichId === userId || task.zugewiesenAn.includes(userId)
      );
    }

    // Blockierung durch Vorstand, Beirat oder Beteiligte
    if (newStatus === "blockiert") {
      return (
        ["VORSTAND", "BEIRAT"].includes(userRole) ||
        task.verantwortlichId === userId ||
        task.zugewiesenAn.includes(userId)
      );
    }

    // Andere Status-Änderungen durch Beteiligte
    return (
      task.verantwortlichId === userId ||
      task.zugewiesenAn.includes(userId) ||
      task.erstelltVon === userId
    );
  }

  async canAssignTask(
    userRole: string,
    userId: string,
    task: Task,
  ): Promise<boolean> {
    // Admin, Vorstand und Beirat können immer zuweisen
    if (["ADMIN", "VORSTAND", "BEIRAT"].includes(userRole)) {
      return true;
    }

    // Verantwortlicher kann zuweisen
    if (task.verantwortlichId === userId) {
      return true;
    }

    // Team-Leiter können Team-Tasks zuweisen
    if (task.context.type === "team" && userRole.startsWith("TEAM_")) {
      // Hier würde geprüft ob die Person das richtige Team leitet
      return true;
    }

    return false;
  }

  canViewTask(userRole: string, userId: string, task: Task): boolean {
    // Admin, Vorstand und Beirat sehen alles
    if (["ADMIN", "VORSTAND", "BEIRAT"].includes(userRole)) {
      return true;
    }

    // Beteiligte sehen ihre Tasks
    if (
      task.verantwortlichId === userId ||
      task.zugewiesenAn.includes(userId) ||
      task.erstelltVon === userId
    ) {
      return true;
    }

    // Team-Mitglieder sehen Team-Tasks
    if (task.context.type === "team" && userRole.startsWith("TEAM_")) {
      // Hier würde geprüft ob die Person im richtigen Team ist
      return true;
    }

    // General Tasks sind für alle Mitglieder sichtbar
    if (task.context.type === "general") {
      return true;
    }

    return false;
  }
}

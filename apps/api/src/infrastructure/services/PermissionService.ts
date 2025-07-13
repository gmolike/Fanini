// apps/api/src/infrastructure/services/PermissionService.ts
import { IPermissionService } from "@/domain/services/IPermissionService";
import { Event, EventStatus } from "@/domain/entities/Event";

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
}

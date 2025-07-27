// apps/api/src/application/use-cases/event/CreateEventUseCase.ts

import type { IEventRepository } from "@/domain/repositories/IEventRepository";
import type { IMemberRepository } from "@/domain/repositories/IMemberRepository";
import type { CreateEventDTO } from "@/application/dto/event";
import { createEvent } from "@/domain/entities/Event";
import {
  createValidationError,
  createPermissionError,
  createBusinessError,
  ERROR_CODES
} from "@/application/dto/common";

/**
 * Create Event Parameters
 */
export type CreateEventParams = {
  /** Event Daten */
  readonly data: CreateEventDTO;
  /** User ID */
  readonly userId: string;
  /** User Rolle */
  readonly userRole: string;
};

/**
 * Create Event Result
 */
export type CreateEventResult = {
  readonly success: boolean;
  readonly eventId?: string;
  readonly requiresApproval?: boolean;
  readonly error?: any;
};

/**
 * Create Event Use Case
 * @description Erstellt ein neues Event mit Approval-Workflow
 */
export type CreateEventUseCase = {
  execute: (params: CreateEventParams) => Promise<CreateEventResult>;
};

/**
 * Factory für CreateEventUseCase
 */
export const createCreateEventUseCase = (
  eventRepository: IEventRepository,
  memberRepository: IMemberRepository
): CreateEventUseCase => ({
  execute: async ({ data, userId, userRole }) => {
    try {
      // 1. Berechtigungsprüfung
      const canCreate = canCreateEvent(userRole);
      if (!canCreate) {
        return {
          success: false,
          error: createPermissionError("Event erstellen"),
        };
      }

      // 2. Validierung: Datum in Zukunft
      const eventDate = new Date(data.date);
      if (eventDate < new Date()) {
        return {
          success: false,
          error: createValidationError(
            "date",
            "Event-Datum muss in der Zukunft liegen"
          ),
        };
      }

      // 3. Validierung: Verantwortlicher existiert
      const responsible = await memberRepository.findById(data.responsibleMemberId);
      if (!responsible || !responsible.ist_aktiv) {
        return {
          success: false,
          error: createBusinessError(
            "Verantwortlicher muss ein aktives Mitglied sein",
            ERROR_CODES.BUSINESS_RULE_VIOLATION,
            { responsibleMemberId: data.responsibleMemberId }
          ),
        };
      }

      // 4. Validierung: Stellvertreter existieren
      if (data.deputyMemberIds && data.deputyMemberIds.length > 0) {
        for (const deputyId of data.deputyMemberIds) {
          const deputy = await memberRepository.findById(deputyId);
          if (!deputy || !deputy.ist_aktiv) {
            return {
              success: false,
              error: createBusinessError(
                `Stellvertreter ${deputyId} ist kein aktives Mitglied`,
                ERROR_CODES.BUSINESS_RULE_VIOLATION,
                { deputyId }
              ),
            };
          }
        }
      }

      // 5. Budget-Validierung
      if (data.budget !== undefined && userRole !== "VORSTAND") {
        return {
          success: false,
          error: createPermissionError("Budget festlegen", "Event"),
        };
      }

      // 6. Event erstellen
      const event = createEvent({
        title: data.title,
        description: data.description,
        shortDescription: data.shortDescription,
        date: eventDate,
        time: data.time,
        location: data.location,
        type: data.type,
        responsibleMemberId: data.responsibleMemberId,
        createdBy: userId,
        isPublic: data.isPublic || false,
      });

      // Erweiterte Felder
      const fullEvent = {
        ...event,
        durationMinutes: data.durationMinutes,
        sportBereich: data.sportBereich,
        deputyMemberIds: data.deputyMemberIds,
        budget: data.budget,
        maxParticipants: data.maxParticipants,
        registrationDeadline: data.registrationDeadline
          ? new Date(data.registrationDeadline)
          : undefined,
        ticketLink: data.ticketLink,
      };

      // 7. Status basierend auf Rolle setzen
      const requiresApproval = needsEventApproval(userRole);
      if (!requiresApproval) {
        // Beirat/Vorstand: Direkt genehmigt
        fullEvent.status = "genehmigt";
        fullEvent.approvedAt = new Date();
        fullEvent.approvedBy = userId;
      }

      // 8. Speichern
      const savedEvent = await eventRepository.save(fullEvent);

      // 9. Status-Historie
      await eventRepository.createStatusHistory({
        eventId: savedEvent.id,
        newStatus: savedEvent.status,
        changedBy: userId,
        comment: requiresApproval
          ? "Event erstellt - wartet auf Genehmigung"
          : "Event erstellt und automatisch genehmigt",
      });

      return {
        success: true,
        eventId: savedEvent.id,
        requiresApproval,
      };

    } catch (error) {
      console.error("CreateEventUseCase error:", error);
      return {
        success: false,
        error: createBusinessError(
          "Fehler beim Erstellen des Events",
          ERROR_CODES.SYSTEM_INTERNAL_ERROR
        ),
      };
    }
  },
});

/**
 * Prüft ob Rolle Events erstellen darf
 */
const canCreateEvent = (userRole: string): boolean => {
  const allowedRoles = ["TEAM_EVENT", "BEIRAT", "VORSTAND", "ADMIN"];
  return allowedRoles.includes(userRole);
};

/**
 * Prüft ob Event-Erstellung Approval benötigt
 */
const needsEventApproval = (userRole: string): boolean => {
  // Beirat und Vorstand brauchen KEINE Approval
  return !["BEIRAT", "VORSTAND", "ADMIN"].includes(userRole);
};

// apps/api/src/application/use-cases/event/GetInternalEventsUseCase.ts

import type { IEventRepository } from "@/domain/repositories/IEventRepository";
import type { IMemberRepository } from "@/domain/repositories/IMemberRepository";
import type { InternalEventListDTO, EventPermissionsDTO } from "@/application/dto/event";
import type { PaginationParams, PaginationDTO } from "@/application/dto/common";
import {
  createPaginationDTO,
  normalizePaginationParams,
  calculateOffset
} from "@/application/dto/common";

/**
 * Get Internal Events Parameters
 * @description Parameter für interne Event-Abfrage
 */
export type GetInternalEventsParams = {
  /** Aktuelle User ID */
  readonly userId: string;

  /** Aktuelle User Rolle */
  readonly userRole: string;

  /** Filter-Optionen */
  readonly filters?: {
    /** Event Status Filter */
    readonly status?: string[];

    /** Event Typ Filter */
    readonly type?: string;

    /** Sportbereich Filter */
    readonly sportBereich?: string;

    /** Von Datum (YYYY-MM-DD) */
    readonly fromDate?: string;

    /** Bis Datum (YYYY-MM-DD) */
    readonly toDate?: string;

    /** Verantwortlicher Filter */
    readonly responsibleId?: string;

    /** Suchbegriff */
    readonly search?: string;

    /** Gelöschte Events einschließen */
    readonly includeDeleted?: boolean;

    /** Nur eigene Events */
    readonly onlyMyEvents?: boolean;
  };

  /** Pagination */
  readonly pagination?: PaginationParams;
};

/**
 * Get Internal Events Result
 * @description Ergebnis mit Events und Pagination
 */
export type GetInternalEventsResult = {
  /** Event Liste */
  readonly items: InternalEventListDTO[];

  /** Pagination Info */
  readonly pagination: PaginationDTO;
};

/**
 * Get Internal Events Use Case
 * @description Lädt Events für interne Nutzer mit Berechtigungen
 */
export type GetInternalEventsUseCase = {
  execute: (params: GetInternalEventsParams) => Promise<GetInternalEventsResult>;
};

/**
 * Factory für GetInternalEventsUseCase
 */
export const createGetInternalEventsUseCase = (
  eventRepository: IEventRepository,
  memberRepository: IMemberRepository
): GetInternalEventsUseCase => ({
  execute: async ({ userId, userRole, filters = {}, pagination }) => {
    // Normalize pagination
    const paginationNormalized = normalizePaginationParams(pagination);

    // Repository Filter aufbauen
    const repositoryFilters: any = {
      status: filters.status,
      type: filters.type,
      sportBereich: filters.sportBereich,
      fromDate: filters.fromDate ? new Date(filters.fromDate) : undefined,
      toDate: filters.toDate ? new Date(filters.toDate) : undefined,
      includeDeleted: filters.includeDeleted,
    };

    // Rollenbasierte Filter
    if (filters.onlyMyEvents || userRole === "TEAM_EVENT") {
      // Team Event sieht nur eigene Events
      repositoryFilters.createdBy = userId;
    }

    if (filters.responsibleId) {
      repositoryFilters.responsibleId = filters.responsibleId;
    }

    // Events laden
    const allEvents = await eventRepository.findAll(repositoryFilters);

    // Suche anwenden
    let filteredEvents = allEvents;
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filteredEvents = allEvents.filter(event =>
        event.title.toLowerCase().includes(searchLower) ||
        event.shortDescription?.toLowerCase().includes(searchLower) ||
        event.location.name.toLowerCase().includes(searchLower)
      );
    }

    // Sortierung: Neueste zuerst
    const sortedEvents = [...filteredEvents].sort((a, b) =>
      b.updatedAt.getTime() - a.updatedAt.getTime()
    );

    // Pagination anwenden
    const offset = calculateOffset(
      paginationNormalized.page,
      paginationNormalized.pageSize
    );
    const paginatedEvents = sortedEvents.slice(
      offset,
      offset + paginationNormalized.pageSize
    );

    // Erweiterte Daten laden
    const eventsWithDetails = await Promise.all(
      paginatedEvents.map(async (event) => {
        // Parallele Datenabfragen
        type TaskStats = { total: number; completed: number; overdue?: number };
        const [responsible, participantCount, taskStats] = await Promise.all([
          memberRepository.findById(event.responsibleMemberId),
          eventRepository.getParticipantCount(event.id),
          eventRepository.getTaskStats(event.id) as Promise<TaskStats>, // Inkludiert jetzt overdue
        ]);

        // Deputies laden
        const deputies = event.deputyMemberIds
          ? await Promise.all(
              event.deputyMemberIds.map(id => memberRepository.findById(id))
            ).then(results => results.filter(Boolean))
          : [];

        // Ersteller laden
        const createdBy = await memberRepository.findById(event.createdBy);

        return {
          event,
          responsible,
          deputies,
          participantCount,
          taskStats,
          createdBy
        };
      })
    );

    // Map zu DTOs
    const items: InternalEventListDTO[] = eventsWithDetails.map(
      ({ event, responsible, deputies, participantCount, taskStats, createdBy }) => ({
        // Public fields
        id: event.id,
        title: event.title,
        shortDescription: event.shortDescription,
        date: event.date.toISOString(),
        time: event.time,
        durationMinutes: event.durationMinutes,
        location: {
          name: event.location.name,
          address: event.location.address,
          description: event.location.description,
          mapsUrl: event.location.address
            ? `https://maps.google.com/?q=${encodeURIComponent(event.location.address)}`
            : undefined,
        },
        type: event.type,
        sportBereich: event.sportBereich,
        maxParticipants: event.maxParticipants,
        participantCount,
        registrationDeadline: event.registrationDeadline?.toISOString(),
        ticketLink: event.ticketLink,
        canRegister: canRegisterForEvent(event, participantCount),
        coverImageUrl: undefined, // TODO: Implement media

        // Internal fields
        status: event.status,
        responsibleMember: {
          id: responsible.id,
          name: `${responsible.vorname} ${responsible.nachname}`,
          avatarUrl: responsible.profilbild,
          role: undefined, // TODO: Load primary role
        },
        deputyMembers: deputies.map(deputy => ({
          id: deputy.id,
          name: `${deputy.vorname} ${deputy.nachname}`,
          avatarUrl: deputy.profilbild,
          role: undefined,
        })),
        budget: canViewBudget(userRole) ? event.budget : undefined,
        budgetUsed: canViewBudget(userRole) ? event.budgetUsed : undefined,
        taskStats: {
          total: taskStats.total,
          completed: taskStats.completed,
          overdue: (typeof taskStats.overdue !== "undefined" ? taskStats.overdue : 0),
        },
        isConfidential: event.isConfidential,
        createdBy: {
          id: createdBy?.id || event.createdBy,
          name: createdBy ? `${createdBy.vorname} ${createdBy.nachname}` : "Unbekannt",
          avatarUrl: createdBy?.profilbild,
          role: undefined,
        },
        createdAt: event.createdAt.toISOString(),
        updatedAt: event.updatedAt.toISOString(),
        permissions: getEventPermissions(event, userId, userRole),
      })
    );

    // Erstelle Pagination DTO
    const paginationResult = createPaginationDTO({
      page: paginationNormalized.page,
      pageSize: paginationNormalized.pageSize,
      totalItems: sortedEvents.length,
    });

    return {
      items,
      pagination: paginationResult,
    };
  },
});

/**
 * Berechnet Event-Berechtigungen für den aktuellen User
 */
const getEventPermissions = (
  event: any,
  userId: string,
  userRole: string
): EventPermissionsDTO => {
  const isCreator = event.createdBy === userId;
  const isResponsible = event.responsibleMemberId === userId;
  const isDeputy = event.deputyMemberIds?.includes(userId) || false;
  const isLeadership = ["VORSTAND", "BEIRAT", "ADMIN"].includes(userRole);

  return {
    canEdit: isCreator || isResponsible || isDeputy || isLeadership,
    canDelete: (isCreator && event.status === "entwurf") || userRole === "ADMIN",
    canChangeStatus: isLeadership || (isCreator && event.status === "entwurf"),
    canManageTasks: isCreator || isResponsible || isDeputy || isLeadership,
    canManageParticipants: isResponsible || isDeputy || isLeadership,
    canViewBudget: isLeadership,
    canEditBudget: userRole === "VORSTAND",
    canApprove: ["VORSTAND", "BEIRAT"].includes(userRole),
  };
};

/**
 * Prüft ob User Budget sehen darf
 */
const canViewBudget = (userRole: string): boolean => {
  return ["VORSTAND", "BEIRAT", "ADMIN"].includes(userRole);
};

/**
 * Prüft ob Registrierung für Event möglich ist
 */
const canRegisterForEvent = (
  event: any,
  currentParticipants: number
): boolean => {
  // Event muss in der Zukunft liegen
  if (event.date < new Date()) return false;

  // Anmeldeschluss prüfen
  if (event.registrationDeadline && event.registrationDeadline < new Date()) {
    return false;
  }

  // Maximale Teilnehmerzahl prüfen
  if (event.maxParticipants && currentParticipants >= event.maxParticipants) {
    return false;
  }

  return true;
};

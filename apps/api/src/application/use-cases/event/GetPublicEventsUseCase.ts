// apps/api/src/application/use-cases/event/GetPublicEventsUseCase.ts

import type { IEventRepository } from "@/domain/repositories/IEventRepository";
import type { PublicEventListDTO } from "@/application/dto/event";
import type { PaginationParams, PaginationDTO } from "@/application/dto/common";
import {
  createPaginationDTO,
  normalizePaginationParams,
  calculateOffset
} from "@/application/dto/common";

/**
 * Get Public Events Parameters
 * @description Filter und Pagination für öffentliche Events
 */
export type GetPublicEventsParams = {
  /** Filter-Optionen */
  readonly filters?: {
    /** Event Typ */
    readonly type?: string;
    /** Sportbereich */
    readonly sportBereich?: string;
    /** Von Datum (YYYY-MM-DD) */
    readonly fromDate?: string;
    /** Bis Datum (YYYY-MM-DD) */
    readonly toDate?: string;
    /** Suchbegriff */
    readonly search?: string;
  };
  /** Pagination */
  readonly pagination?: PaginationParams;
};

/**
 * Get Public Events Result
 * @description Ergebnis mit Events und Pagination
 */
export type GetPublicEventsResult = {
  /** Event Liste */
  readonly items: PublicEventListDTO[];
  /** Pagination Info */
  readonly pagination: PaginationDTO;
};

/**
 * Get Public Events Use Case
 * @description Lädt öffentlich sichtbare Events
 */
export type GetPublicEventsUseCase = {
  execute: (params: GetPublicEventsParams) => Promise<GetPublicEventsResult>;
};

/**
 * Factory für GetPublicEventsUseCase
 */
export const createGetPublicEventsUseCase = (
  eventRepository: IEventRepository
): GetPublicEventsUseCase => ({
  execute: async ({ filters = {}, pagination }) => {
    // Normalize pagination
    const paginationNormalized = normalizePaginationParams(pagination);

    // Business Logic: Nur genehmigte, öffentliche Events
    const repositoryFilters = {
      status: "genehmigt" as const,
      isPublic: true,
      type: filters.type,
      sportBereich: filters.sportBereich,
      fromDate: filters.fromDate ? new Date(filters.fromDate) : undefined,
      toDate: filters.toDate ? new Date(filters.toDate) : undefined,
    };

    // Lade alle gefilterten Events
    const allEvents = await eventRepository.findAll(repositoryFilters);

    // Suche anwenden (wenn vorhanden)
    let filteredEvents = allEvents;
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filteredEvents = allEvents.filter(event =>
        event.title.toLowerCase().includes(searchLower) ||
        event.shortDescription?.toLowerCase().includes(searchLower) ||
        event.location.name.toLowerCase().includes(searchLower)
      );
    }

    // Sortierung: Datum aufsteigend (zukünftige Events zuerst)
    const sortedEvents = [...filteredEvents].sort((a, b) =>
      a.date.getTime() - b.date.getTime()
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

    // Lade zusätzliche Daten (Teilnehmerzahl)
    const eventsWithCounts = await Promise.all(
      paginatedEvents.map(async (event) => {
        const participantCount = await eventRepository.getParticipantCount(event.id);
        return { event, participantCount };
      })
    );

    // Map zu DTOs
    const items: PublicEventListDTO[] = eventsWithCounts.map(({ event, participantCount }) => ({
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
    }));

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
 * Prüft ob Registrierung möglich ist
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

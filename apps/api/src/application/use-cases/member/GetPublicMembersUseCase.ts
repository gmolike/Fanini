// apps/api/src/application/use-cases/member/GetPublicMembersUseCase.ts

import type { IMemberRepository } from "@/domain/repositories/IMemberRepository";
import type { PublicMemberListDTO } from "@/application/dto/member";
import type { PaginationParams, PaginationDTO } from "@/application/dto/common";
import {
  createPaginationDTO,
  normalizePaginationParams,
  calculateOffset
} from "@/application/dto/common";

/**
 * Get Public Members Parameters
 */
export type GetPublicMembersParams = {
  /** Filter-Optionen */
  readonly filters?: {
    /** Suchbegriff */
    readonly search?: string;
    /** Nur Creator anzeigen */
    readonly creatorsOnly?: boolean;
    /** Nach Rolle filtern */
    readonly role?: string;
  };
  /** Pagination */
  readonly pagination?: PaginationParams;
};

/**
 * Get Public Members Result
 */
export type GetPublicMembersResult = {
  /** Mitglieder Liste */
  readonly items: PublicMemberListDTO[];
  /** Pagination Info */
  readonly pagination: PaginationDTO;
};

/**
 * Get Public Members Use Case
 * @description Lädt öffentlich sichtbare Mitglieder
 */
export type GetPublicMembersUseCase = {
  execute: (params: GetPublicMembersParams) => Promise<GetPublicMembersResult>;
};

/**
 * Factory für GetPublicMembersUseCase
 */
export const createGetPublicMembersUseCase = (
  memberRepository: IMemberRepository
): GetPublicMembersUseCase => ({
  execute: async ({ filters = {}, pagination }) => {
    // Normalize pagination
    const paginationNormalized = normalizePaginationParams(pagination);

    // Repository Filter
    const repositoryFilters = {
      active: true, // Nur aktive Mitglieder öffentlich
      search: filters.search,
      roleId: filters.role,
    };

    // Lade alle gefilterten Mitglieder
    const allMembers = await memberRepository.findAll(repositoryFilters);

    // Creator Filter
    let filteredMembers = allMembers;
    if (filters.creatorsOnly) {
      filteredMembers = allMembers.filter(member => member.is_creator);
    }

    // Sortierung: Name alphabetisch
    const sortedMembers = [...filteredMembers].sort((a, b) =>
      `${a.vorname} ${a.nachname}`.localeCompare(`${b.vorname} ${b.nachname}`)
    );

    // Pagination anwenden
    const offset = calculateOffset(
      paginationNormalized.page,
      paginationNormalized.pageSize
    );
    const paginatedMembers = sortedMembers.slice(
      offset,
      offset + paginationNormalized.pageSize
    );

    // Map zu DTOs
    const items: PublicMemberListDTO[] = paginatedMembers.map(member => ({
      id: member.id,
      name: `${member.vorname} ${member.nachname}`,
      memberSince: member.mitglied_seit.toISOString(),
      avatarUrl: member.profilbild,
      description: member.beschreibung,
      isCreator: member.is_creator || false,
      primaryRole: member.primary_role_name,
    }));

    // Erstelle Pagination DTO
    const paginationResult = createPaginationDTO({
      page: paginationNormalized.page,
      pageSize: paginationNormalized.pageSize,
      totalItems: sortedMembers.length,
    });

    return {
      items,
      pagination: paginationResult,
    };
  },
});

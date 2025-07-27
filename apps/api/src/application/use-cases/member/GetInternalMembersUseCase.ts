// apps/api/src/application/use-cases/member/GetInternalMembersUseCase.ts

import type { IMemberRepository } from "@/domain/repositories/IMemberRepository";
import type { InternalMemberListDTO, MemberPermissionsDTO } from "@/application/dto/member";
import type { PaginationParams, PaginationDTO } from "@/application/dto/common";
import type { MemberDataFilterService } from "@/application/services/MemberDataFilterService";
import type { Permission } from "@/domain/value-objects/Permission";
import {
  createPaginationDTO,
  normalizePaginationParams,
  calculateOffset
} from "@/application/dto/common";

/**
 * Get Internal Members Parameters
 */
export type GetInternalMembersParams = {
  /** User Permissions */
  readonly userPermissions: Permission[];

  /** User ID */
  readonly userId: string;

  /** User Role */
  readonly userRole: string;

  /** Filter-Optionen */
  readonly filters?: {
    /** Aktiv-Status */
    readonly active?: boolean;
    /** Suchbegriff */
    readonly search?: string;
    /** Nach Rolle filtern */
    readonly roleId?: string;
    /** Mit Vertraulichkeitserklärung */
    readonly hasConfidentialityAgreement?: boolean;
  };

  /** Pagination */
  readonly pagination?: PaginationParams;
};

/**
 * Get Internal Members Result
 */
export type GetInternalMembersResult = {
  /** Mitglieder Liste */
  readonly items: InternalMemberListDTO[];
  /** Pagination Info */
  readonly pagination: PaginationDTO;
};

/**
 * Get Internal Members Use Case
 * @description Lädt Mitglieder für interne Nutzer mit Permission-basierter Filterung
 */
export type GetInternalMembersUseCase = {
  execute: (params: GetInternalMembersParams) => Promise<GetInternalMembersResult>;
};

/**
 * Factory für GetInternalMembersUseCase
 */
export const createGetInternalMembersUseCase = (
  memberRepository: IMemberRepository,
  memberDataFilterService: MemberDataFilterService
): GetInternalMembersUseCase => ({
  execute: async ({ userPermissions, userId, userRole, filters = {}, pagination }) => {
    // Normalize pagination
    const paginationNormalized = normalizePaginationParams(pagination);

    // Repository Filter
    const repositoryFilters = {
      active: filters.active,
      search: filters.search,
      roleId: filters.roleId,
    };

    // Lade alle gefilterten Mitglieder
    const allMembers = await memberRepository.findAll(repositoryFilters);

    // Zusätzliche Filter
    let filteredMembers = allMembers;
    if (filters.hasConfidentialityAgreement !== undefined) {
      filteredMembers = allMembers.filter(
        member => member.hat_vertraulichkeitserklaerung === filters.hasConfidentialityAgreement
      );
    }

    // Sortierung: Zuletzt aktualisiert zuerst
    const sortedMembers = [...filteredMembers].sort((a, b) =>
      b.aktualisiert_am.getTime() - a.aktualisiert_am.getTime()
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

    // Map zu DTOs mit Permission-basierter Filterung
    const items: InternalMemberListDTO[] = paginatedMembers.map(member => {
      // Filtere sensitive Daten basierend auf Permissions
      const filteredMember = memberDataFilterService.filterMemberData(
        member,
        userPermissions
      );

      // Berechne Permissions für dieses Mitglied
      const permissions = getMemberPermissions(member, userId, userRole, userPermissions);

      return {
        id: member.id,
        name: `${member.vorname} ${member.nachname}`,
        memberSince: member.mitglied_seit.toISOString(),
        avatarUrl: member.profilbild,
        description: member.beschreibung,
        isCreator: member.is_creator || false,
        primaryRole: member.primary_role_name,
        email: permissions.canViewEmail ? filteredMember.email : undefined,
        phone: permissions.canViewPhone ? filteredMember.telefon : undefined,
        roles: member.roles || [],
        isActive: member.ist_aktiv,
        lastLogin: member.letzter_login?.toISOString(),
        hasConfidentialityAgreement: member.hat_vertraulichkeitserklaerung,
        permissions,
      };
    });

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

/**
 * Berechnet Member-Permissions für den aktuellen User
 */
const getMemberPermissions = (
  member: any,
  userId: string,
  userRole: string,
  userPermissions: Permission[]
): MemberPermissionsDTO => {
  const isOwnProfile = member.user_id === userId;
  const isAdmin = userRole === "ADMIN";
  const isVorstand = userRole === "VORSTAND";
  const isBeirat = userRole === "BEIRAT";

  // Helper für Permission Check
  const hasPermission = (permission: string): boolean => {
    return userPermissions.some(p =>
      p.resource === "*" ||
      (p.resource === "member" && (p.action === "*" || p.action === permission.split(".")[1]))
    );
  };

  return {
    canViewEmail: isOwnProfile || hasPermission("member.view_contact"),
    canViewPhone: isOwnProfile || hasPermission("member.view_contact"),
    canViewAddress: isOwnProfile || hasPermission("member.view_sensitive"),
    canViewSensitive: isOwnProfile || hasPermission("member.view_sensitive"),
    canEdit: isOwnProfile || hasPermission("member.edit_all"),
    canEditRoles: hasPermission("member.assign_role"),
    canDeactivate: isAdmin || isVorstand,
    canViewAuditLog: isAdmin || isVorstand,
  };
};

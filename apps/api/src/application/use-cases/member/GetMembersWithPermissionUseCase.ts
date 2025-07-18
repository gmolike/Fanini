// apps/api/src/application/use-cases/auth/GetUserPermissionsUseCase.ts
import { MemberDataFilterService } from "@/application/services/MemberDataFilterService";
import { IMemberRepository } from "@/domain/repositories";
import type { Permission } from "@/domain/value-objects/Permission";

/**
 * Get User Permissions Use Case
 * @description Lädt alle Berechtigungen eines Benutzers basierend auf seinen Rollen
 */
export type GetMembersWithPermissionUseCase = {
  execute: (params: {
    userPermissions: Permission[];
    filters?: {
      active?: boolean;
      search?: string;
      roleId?: string;
    };
  }) => Promise<any[]>;
};

// EXPORT ALS FACTORY FUNCTION (wie die anderen Use Cases auch!)
export const createGetMembersWithPermissionUseCase = (
  memberRepository: IMemberRepository,
  filterService: MemberDataFilterService,
): GetMembersWithPermissionUseCase => ({
  execute: async ({ userPermissions, filters }) => {
    // Lade alle Mitglieder (unfiltered)
    const members = await memberRepository.findAll(filters);

    // Filtere Daten basierend auf Permissions
    return members.map((member) =>
      filterService.filterMemberData(member, userPermissions),
    );
  },
});

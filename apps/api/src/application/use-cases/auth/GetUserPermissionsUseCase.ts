// apps/api/src/application/use-cases/auth/GetUserPermissionsUseCase.ts
import type { IAuthRepository } from "@/domain/repositories/IAuthRepository";
import type { IPermissionRepository } from "@/domain/repositories/IPermissionRepository";
import type { Permission } from "@/domain/value-objects/Permission";
import { createPermissionFromString } from "@/domain/value-objects/Permission";
import { rolePermissions } from "@/domain/constants/roles";

/**
 * Get User Permissions Use Case
 * @description Lädt alle Berechtigungen eines Benutzers basierend auf seinen Rollen
 */
export type GetUserPermissionsUseCase = {
  execute: (params: { userId: string }) => Promise<{
    permissions: Permission[];
    roles: string[];
  }>;
};

export const createGetUserPermissionsUseCase = (
  authRepository: IAuthRepository,
  permissionRepository: IPermissionRepository,
): GetUserPermissionsUseCase => ({
  execute: async ({ userId }) => {
    // Lade User Rollen
    const userRoles = await authRepository.getUserRoles(userId);

    // Sammle alle Permissions
    const allPermissions: Permission[] = [];
    const roles: string[] = [];
    const processedRoles = new Set<string>();

    for (const role of userRoles) {
      roles.push(role.name);

      // Lade direkte Permissions der Rolle
      const rolePerms = await permissionRepository.getPermissionsByRole(
        role.id,
      );
      allPermissions.push(...rolePerms);

      // Lade Standard-Permissions aus Konstanten
      const standardPerms =
        rolePermissions[role.name as keyof typeof rolePermissions] || [];
      const mappedPerms = standardPerms.map((p) =>
        createPermissionFromString(p),
      );
      allPermissions.push(...mappedPerms);
    }

    // Lade Hierarchie und vererbte Permissions
    const hierarchy = await permissionRepository.getRoleHierarchy();

    for (const role of userRoles) {
      const parentRoles = getParentRoles(role.id, hierarchy);

      for (const parentRoleId of parentRoles) {
        if (!processedRoles.has(parentRoleId)) {
          processedRoles.add(parentRoleId);
          const parentPerms =
            await permissionRepository.getPermissionsByRole(parentRoleId);
          allPermissions.push(...parentPerms);
        }
      }
    }

    // Dedupliziere Permissions
    const uniquePermissions = deduplicatePermissions(allPermissions);

    return {
      permissions: uniquePermissions,
      roles,
    };
  },
});

/**
 * Helper: Ermittelt Parent-Rollen aus der Hierarchie
 */
const getParentRoles = (
  roleId: string,
  hierarchy: Record<string, string[]>,
): string[] => {
  const parents: string[] = [];

  for (const [parent, children] of Object.entries(hierarchy)) {
    if (children.includes(roleId)) {
      parents.push(parent);
    }
  }

  return parents;
};

/**
 * Helper: Dedupliziert Permissions
 */
const deduplicatePermissions = (permissions: Permission[]): Permission[] => {
  const uniqueMap = new Map<string, Permission>();

  for (const permission of permissions) {
    const key = `${permission.resource}.${permission.action}`;

    // Wildcard Permissions haben Vorrang
    if (permission.resource === "*" || permission.action === "*") {
      uniqueMap.set(key, permission);
    } else if (!uniqueMap.has(key)) {
      uniqueMap.set(key, permission);
    }
  }

  return Array.from(uniqueMap.values());
};

// apps/api/src/presentation/middleware/permissionMiddleware.ts

import type { Container } from "@/infrastructure/di/container";
import { createPermissionFromString } from "@/domain/value-objects/Permission";

/**
 * Permission Middleware
 * @description Prüft ob Benutzer die benötigte Berechtigung hat
 */
export const createPermissionMiddleware = (
  container: Container,
  requiredPermission: string,
) => {
  return async (
    req: Request,
    next: () => Promise<Response>,
  ): Promise<Response> => {
    try {
      const userId = (req as any).userId;
      if (!userId) {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
      }

      // Lade User Permissions
      const getUserPermissions = container.get("GetUserPermissionsUseCase");
      const { permissions } = await getUserPermissions.execute({ userId });

      // Prüfe Permission
      const required = createPermissionFromString(requiredPermission);
      const permissionService = container.get("PermissionService");

      if (!permissionService.hasPermission(permissions, required)) {
        return Response.json(
          { error: "Insufficient permissions" },
          { status: 403 },
        );
      }

      // Permissions an Request anhängen
      (req as any).userPermissions = permissions;

      return next();
    } catch (error) {
      console.error("Permission middleware error:", error);
      return Response.json({ error: "Authorization failed" }, { status: 500 });
    }
  };
};

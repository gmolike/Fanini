// apps/api/src/domain/value-objects/Permission.ts

/**
 * Permission Value Object
 * @description Repräsentiert eine einzelne Berechtigung im System
 */
export type Permission = {
  readonly resource: string;
  readonly action: string;
  readonly conditions?: Record<string, any>;
};

/**
 * Erstellt eine Permission aus String-Format
 * @param permissionString Format: "resource.action" oder "resource.action:condition"
 */
export const createPermissionFromString = (permissionString: string): Permission => {
  const [resourceAction, conditionString] = permissionString.split(':');
  const [resource, action] = resourceAction.split('.');

  if (!resource || !action) {
    throw new Error(`Invalid permission string: ${permissionString}`);
  }

  const conditions = conditionString
    ? JSON.parse(conditionString)
    : undefined;

  return { resource, action, conditions };
};

/**
 * Konvertiert Permission zu String
 */
export const permissionToString = (permission: Permission): string => {
  const base = `${permission.resource}.${permission.action}`;
  return permission.conditions
    ? `${base}:${JSON.stringify(permission.conditions)}`
    : base;
};

/**
 * Prüft ob eine Permission eine andere impliziert
 */
export const permissionImplies = (
  permission: Permission,
  requiredPermission: Permission
): boolean => {
  // Wildcard support
  if (permission.resource === '*') return true;
  if (permission.resource !== requiredPermission.resource) return false;

  if (permission.action === '*') return true;
  if (permission.action !== requiredPermission.action) return false;

  // Conditions prüfen
  if (requiredPermission.conditions && !permission.conditions) return false;

  if (requiredPermission.conditions && permission.conditions) {
    for (const [key, value] of Object.entries(requiredPermission.conditions)) {
      if (permission.conditions[key] !== value) return false;
    }
  }

  return true;
};

// apps/api/src/domain/services/PermissionService.ts

import type { Permission } from "@/domain/value-objects/Permission";
import { permissionImplies } from "@/domain/value-objects/Permission";

/**
 * Permission Service (Domain Service)
 * @description Behandelt die Business-Logik für Berechtigungen
 */
export type PermissionService = {
  /**
   * Prüft ob eine Rolle eine andere Rolle zuweisen darf
   */
  canAssignRole: (userRole: string, targetRole: string) => boolean;

  /**
   * Prüft ob ein Feld bearbeitet werden darf
   */
  canEditField: (
    userRole: string,
    fieldName: string,
    entityType: string,
  ) => boolean;

  /**
   * Prüft ob eine Aktion Genehmigung benötigt
   */
  needsApproval: (
    userRole: string,
    action: string,
    fieldName?: string,
  ) => boolean;

  /**
   * Prüft ob Benutzer eine Permission hat
   */
  hasPermission: (
    userPermissions: Permission[],
    requiredPermission: Permission,
  ) => boolean;

  /**
   * Gibt die Hierarchie-Ebene einer Rolle zurück
   */
  getRoleHierarchyLevel: (role: string) => number;
};

/**
 * Role Hierarchy Levels
 */
const roleHierarchy: Record<string, number> = {
  ADMIN: 1,
  VORSTAND: 2,
  BEIRAT: 3,
  KASSENPRUFER: 3,
  TEAM_EVENT: 4,
  TEAM_MEDIEN: 4,
  TEAM_TECHNIK: 4,
  TEAM_VEREIN: 4,
  MITGLIED: 5,
};

/**
 * Fields die Approval benötigen
 */
const approvalRequiredFields: Record<string, string[]> = {
  member: ["mitgliedsnummer", "ist_aktiv", "easyverein_id"],
  event: ["status", "budget"],
  finance: ["betrag", "approved"],
};

/**
 * Implementierung des Permission Service
 */
export const createPermissionService = (): PermissionService => ({
  canAssignRole: (userRole: string, targetRole: string): boolean => {
    const userLevel = roleHierarchy[userRole] || 999;
    const targetLevel = roleHierarchy[targetRole] || 999;

    // Kann nur Rollen zuweisen die niedriger in der Hierarchie sind
    return userLevel < targetLevel;
  },

  canEditField: (
    userRole: string,
    fieldName: string,
    entityType: string,
  ): boolean => {
    // Admin kann alles
    if (userRole === "ADMIN") return true;

    // Spezielle Regeln für sensitive Felder
    const sensitiveFields = ["iban", "geburtsdatum", "adresse"];
    if (sensitiveFields.includes(fieldName)) {
      return ["ADMIN", "VORSTAND"].includes(userRole);
    }

    // Standard Berechtigungen
    return true;
  },

  needsApproval: (
    userRole: string,
    action: string,
    fieldName?: string,
  ): boolean => {
    // Admin und Vorstand brauchen keine Approval
    if (["ADMIN", "VORSTAND"].includes(userRole)) return false;

    // Prüfe ob das Feld Approval braucht
    if (fieldName && action === "edit") {
      const entityType = "member"; // TODO: dynamisch ermitteln
      const fields = approvalRequiredFields[entityType] || [];
      return fields.includes(fieldName);
    }

    // Rollenzuweisung braucht immer Approval (außer Admin/Vorstand)
    if (action === "assign_role") return true;

    return false;
  },

  hasPermission: (
    userPermissions: Permission[],
    requiredPermission: Permission,
  ): boolean => {
    return userPermissions.some((perm) =>
      permissionImplies(perm, requiredPermission),
    );
  },

  getRoleHierarchyLevel: (role: string): number => {
    return roleHierarchy[role] || 999;
  },
});

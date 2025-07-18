// apps/api/src/application/services/MemberDataFilterService.ts

import type { Permission } from '@/domain/value-objects/Permission';
import { memberSensitiveFields, type SensitiveField } from '@/domain/value-objects/SensitiveField';
import { createPermissionFromString } from '@/domain/value-objects/Permission';
import type { PermissionService } from '@/domain/services/PermissionService';

/**
 * Member Data Filter Service
 * @description Filtert Mitgliederdaten basierend auf Berechtigungen
 */
export type MemberDataFilterService = {
  /**
   * Filtert Mitgliederdaten basierend auf Berechtigungen
   */
  filterMemberData: (member: any, userPermissions: Permission[]) => any;

  /**
   * Gibt alle sensitiven Felder zurück
   */
  getSensitiveFields: () => Record<string, SensitiveField>;

  /**
   * Prüft ob ein Feld sichtbar ist
   */
  isFieldVisible: (fieldName: string, userPermissions: Permission[]) => boolean;
};

/**
 * Erstellt den Member Data Filter Service
 */
export const createMemberDataFilterService = (
  permissionService: PermissionService
): MemberDataFilterService => ({
  filterMemberData: (member: any, userPermissions: Permission[]) => {
    const filtered: any = {
      id: member.id,
      vorname: member.vorname,
      nachname: member.nachname,
      mitgliedSeit: member.mitgliedSeit,
      istAktiv: member.istAktiv,
    };

    // Prüfe jedes sensitive Feld
    for (const [fieldName, fieldConfig] of Object.entries(memberSensitiveFields)) {
      const requiredPermission = createPermissionFromString(fieldConfig.requiredPermission);

      if (permissionService.hasPermission(userPermissions, requiredPermission)) {
        filtered[fieldName] = member[fieldName];
      }
    }

    // Nicht-sensitive Felder hinzufügen
    const nonSensitiveFields = [
      'profilbild',
      'beschreibung',
      'hatVertraulichkeitserklaerung',
    ];

    for (const field of nonSensitiveFields) {
      if (member[field] !== undefined) {
        filtered[field] = member[field];
      }
    }

    return filtered;
  },

  getSensitiveFields: () => memberSensitiveFields,

  isFieldVisible: (fieldName: string, userPermissions: Permission[]) => {
    const fieldConfig = memberSensitiveFields[fieldName];
    if (!fieldConfig) return true; // Nicht-sensitive Felder sind immer sichtbar

    const requiredPermission = createPermissionFromString(fieldConfig.requiredPermission);
    return permissionService.hasPermission(userPermissions, requiredPermission);
  }
});

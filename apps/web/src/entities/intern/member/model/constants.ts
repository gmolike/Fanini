// apps/web/src/entities/intern/member/model/constants.ts
import { ROLE_LABELS, ROLE_COLORS } from '@faninitiative/shared';
import { createEnumVariantConfig } from '@/shared/ui';
import type { MemberRole } from '@faninitiative/shared';

// Re-export shared constants
export { ROLE_LABELS } from '@faninitiative/shared';

/**
 * Role configuration for UI components
 * @description Combines labels and colors for role badges
 */
export const ROLE_CONFIG = Object.entries(ROLE_LABELS).reduce(
  (acc, [key, label]) => {
    const role = key as MemberRole;
    const colors = ROLE_COLORS[role];

    acc[role] = {
      label,
      variant: getVariantFromRole(role),
    };

    return acc;
  },
  {} as Record<MemberRole, { label: string; variant: string }>
);

/**
 * Helper to get variant from role
 */
const getVariantFromRole = (role: MemberRole): string => {
  const variantMap: Record<MemberRole, string> = {
    ADMIN: 'error',
    VORSTAND: 'purple',
    BEIRAT: 'info',
    KASSENPRUFER: 'orange',
    TEAM_EVENT: 'success',
    TEAM_TECHNIK: 'info',
    TEAM_MEDIEN: 'warning',
    TEAM_VEREIN: 'default',
    MITGLIED: 'outline',
  };

  return variantMap[role];
};

// Keep existing Sichtbarkeit config
const SichtbarkeitEnum = {
  alle: 'alle',
  mitglieder: 'mitglieder',
  vorstand: 'vorstand',
  niemand: 'niemand',
} as const;

export const SICHTBARKEIT_CONFIG = createEnumVariantConfig(SichtbarkeitEnum, {
  alle: {
    label: 'Öffentlich',
    variant: 'success',
  },
  mitglieder: {
    label: 'Nur Mitglieder',
    variant: 'info',
  },
  vorstand: {
    label: 'Nur Vorstand',
    variant: 'warning',
  },
  niemand: {
    label: 'Privat',
    variant: 'error',
  },
});

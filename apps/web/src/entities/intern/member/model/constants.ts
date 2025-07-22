import { createEnumVariantConfig } from '@/shared/ui';

const SichtbarkeitEnum = {
  alle: 'alle',
  mitglieder: 'mitglieder',
  vorstand: 'vorstand',
  niemand: 'niemand',
} as const;

// Role Enum Type
export type MemberRole =
  | 'ADMIN'
  | 'VORSTAND'
  | 'BEIRAT'
  | 'KASSENPRUFER'
  | 'TEAM_EVENT'
  | 'TEAM_TECHNIK'
  | 'TEAM_MEDIEN'
  | 'TEAM_VEREIN'
  | 'MITGLIED';

// Role Labels Map
const ROLE_LABELS: Record<MemberRole, string> = {
  ADMIN: 'Administrator',
  VORSTAND: 'Vorstand',
  BEIRAT: 'Beirat',
  KASSENPRUFER: 'Kassenprüfer',
  TEAM_EVENT: 'Team Event',
  TEAM_TECHNIK: 'Team Technik',
  TEAM_MEDIEN: 'Team Medien',
  TEAM_VEREIN: 'Team Verein',
  MITGLIED: 'Mitglied',
};

// Role Configuration mit createEnumVariantConfig
export const ROLE_CONFIG = createEnumVariantConfig(
  {
    ADMIN: 'ADMIN',
    VORSTAND: 'VORSTAND',
    BEIRAT: 'BEIRAT',
    KASSENPRUFER: 'KASSENPRUFER',
    TEAM_EVENT: 'TEAM_EVENT',
    TEAM_TECHNIK: 'TEAM_TECHNIK',
    TEAM_MEDIEN: 'TEAM_MEDIEN',
    TEAM_VEREIN: 'TEAM_VEREIN',
    MITGLIED: 'MITGLIED',
  } as const,
  {
    ADMIN: {
      label: 'Administrator',
      variant: 'error',
    },
    VORSTAND: {
      label: 'Vorstand',
      variant: 'purple',
    },
    BEIRAT: {
      label: 'Beirat',
      variant: 'info',
    },
    KASSENPRUFER: {
      label: 'Kassenprüfer',
      variant: 'orange',
    },
    TEAM_EVENT: {
      label: 'Team Event',
      variant: 'success',
    },
    TEAM_TECHNIK: {
      label: 'Team Technik',
      variant: 'info',
    },
    TEAM_MEDIEN: {
      label: 'Team Medien',
      variant: 'warning',
    },
    TEAM_VEREIN: {
      label: 'Team Verein',
      variant: 'default',
    },
    MITGLIED: {
      label: 'Mitglied',
      variant: 'outline',
    },
  }
);

// Helper function to get role label
export const getRoleLabel = (role: MemberRole): string => {
  return ROLE_LABELS[role];
};

// Export role options as constant
export const ROLE_OPTIONS = Object.entries(ROLE_LABELS).map(([value, label]) => ({
  value: value as MemberRole,
  label,
}));

// Sichtbarkeit Configuration
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
export const SENSITIVITY_LABELS = {
  none: 'Keine',
  low: 'Niedrig',
  medium: 'Mittel',
  high: 'Hoch',
  critical: 'Kritisch',
} as const;

export const FIELD_SENSITIVITY = {
  telefon: 'low',
  geburtsdatum: 'medium',
  adresse: 'high',
  notfallkontakt: 'high',
  iban: 'critical',
} as const;

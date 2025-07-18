import { createEnumVariantConfig } from '@/shared/ui';

const SichtbarkeitEnum = {
  alle: 'alle',
  mitglieder: 'mitglieder',
  vorstand: 'vorstand',
  niemand: 'niemand',
} as const;

// Definiere die Enum-Objekte für die Config
const MemberRoleEnum = {
  ADMIN: 'ADMIN',
  VORSTAND: 'VORSTAND',
  BEIRAT: 'BEIRAT',
  KASSENPRUFER: 'KASSENPRUFER',
  TEAM_EVENT: 'TEAM_EVENT',
  TEAM_TECHNIK: 'TEAM_TECHNIK',
  TEAM_MEDIEN: 'TEAM_MEDIEN',
  TEAM_VEREIN: 'TEAM_VEREIN',
  MITGLIED: 'MITGLIED',
} as const;

// Role Configuration mit createEnumVariantConfig
export const ROLE_CONFIG = createEnumVariantConfig(MemberRoleEnum, {
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
});

// Helper function to get role label
export const getRoleLabel = (role: keyof typeof MemberRoleEnum): string => {
  const config = ROLE_CONFIG[role];
  return config ? config.label : role;
};

// Export role options as constant
export const ROLE_OPTIONS = Object.entries(MemberRoleEnum).map(([key, value]) => ({
  value,
  label: getRoleLabel(value),
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

// Rest bleibt gleich...
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

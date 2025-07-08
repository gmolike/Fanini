// frontend/src/features/public/contact-form/model/types.ts
import { Briefcase, Calendar, UserCheck, Users, UsersRound, Wrench } from 'lucide-react';

import type { contactFormSchema } from './schemas';
import type { z } from 'zod';

export type ContactFormValues = z.infer<typeof contactFormSchema>;

export type RecipientType = 'general' | 'team' | 'committee';
export type TeamType = 'events' | 'media' | 'club' | 'tech';
export type CommitteeType = 'board' | 'advisory';

/**
 * Configuration for recipient types
 */
export const RECIPIENT_TYPE_CONFIG = {
  general: {
    label: 'Allgemeine Anfrage',
    description: 'Für allgemeine Fragen und Anliegen',
    requiresDetail: false,
  },
  team: {
    label: 'An ein Team',
    description: 'Direkte Anfrage an eines unserer Teams',
    requiresDetail: true,
    minDetailLength: 30,
  },
  committee: {
    label: 'An ein Gremium',
    description: 'Offizielle Anfrage an Vorstand oder Beirat',
    requiresDetail: true,
    minDetailLength: 50,
  },
} as const;

/**
 * Configuration for teams
 */
export const TEAM_CONFIG = {
  events: {
    label: 'Team Events',
    description: 'Organisation und Durchführung von Veranstaltungen',
    icon: Calendar,
    email: 'events@faninitiative-spandau.de',
  },
  media: {
    label: 'Team Medien',
    description: 'Social Media, Fotos, Videos und Öffentlichkeitsarbeit',
    icon: Users,
    email: 'medien@faninitiative-spandau.de',
  },
  club: {
    label: 'Team Verein',
    description: 'Mitgliederverwaltung und Vereinsorganisation',
    icon: Briefcase,
    email: 'verein@faninitiative-spandau.de',
  },
  tech: {
    label: 'Team Technik',
    description: 'Website, IT und technische Infrastruktur',
    icon: Wrench,
    email: 'technik@faninitiative-spandau.de',
  },
} as const;

/**
 * Configuration for committees
 */
export const COMMITTEE_CONFIG = {
  board: {
    label: 'Vorstand',
    description: 'Geschäftsführung und strategische Entscheidungen',
    icon: UserCheck,
    email: 'vorstand@faninitiative-spandau.de',
  },
  advisory: {
    label: 'Beirat',
    description: 'Beratung und Unterstützung des Vorstands',
    icon: UsersRound,
    email: 'beirat@faninitiative-spandau.de',
  },
} as const;

// Generate options from configs
export const RECIPIENT_TYPE_OPTIONS = Object.entries(RECIPIENT_TYPE_CONFIG).map(
  ([value, config]) => ({
    value,
    label: config.label,
    description: config.description,
  })
);

export const TEAM_OPTIONS = Object.entries(TEAM_CONFIG).map(([value, config]) => ({
  value,
  label: config.label,
  description: config.description,
  icon: config.icon,
}));

export const COMMITTEE_OPTIONS = Object.entries(COMMITTEE_CONFIG).map(([value, config]) => ({
  value,
  label: config.label,
  description: config.description,
  icon: config.icon,
}));

/**
 * Helper to get config for a specific recipient
 */
export const getRecipientConfig = (type: RecipientType, subType?: TeamType | CommitteeType) => {
  if (type === 'team' && subType) {
    return TEAM_CONFIG[subType as TeamType];
  }
  if (type === 'committee' && subType) {
    return COMMITTEE_CONFIG[subType as CommitteeType];
  }
  return null;
};

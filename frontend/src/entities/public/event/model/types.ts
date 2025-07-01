// frontend/src/entities/public/event/model/types.ts
import type {
  publicEventDetailResponseSchema,
  publicEventDetailSchema,
  publicEventListItemSchema,
  publicEventListResponseSchema,
} from './schemas';
import type { z } from 'zod';

// NEUE TYPES (behalten)
export type PublicEventListItem = z.infer<typeof publicEventListItemSchema>;
export type PublicEventDetail = z.infer<typeof publicEventDetailSchema>;
export type PublicEventListResponse = z.infer<typeof publicEventListResponseSchema>;
export type PublicEventDetailResponse = z.infer<typeof publicEventDetailResponseSchema>;

// Type für backward compatibility
export type EventType = PublicEventListItem['type'];

// Configs bleiben unverändert
export const EVENT_TYPE_CONFIG = {
  party: {
    label: 'Party',
    color: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
  },
  away: {
    label: 'Auswärtsfahrt',
    color: 'bg-[var(--color-fanini-red)]/10 text-[var(--color-fanini-red)]',
  },
  meeting: {
    label: 'Versammlung',
    color: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
  },
  match: {
    label: 'Spieltag',
    color: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
  },
  concert: {
    label: 'Konzert',
    color: 'bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-300',
  },
  training: {
    label: 'Training',
    color: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300',
  },
} as const;

export const EVENT_ORGANIZER_CONFIG = {
  faninitiative: {
    name: 'Faninitiative Spandau',
    color: 'var(--color-fanini-blue)',
    bgColor: 'bg-[var(--color-fanini-blue)]/10',
    borderColor: 'border-[var(--color-fanini-blue)]',
    badge: 'bg-[var(--color-fanini-blue)] text-white',
  },
  eintracht: {
    name: 'Eintracht Spandau',
    color: 'var(--color-fanini-red)',
    bgColor: 'bg-[var(--color-fanini-red)]/10',
    borderColor: 'border-[var(--color-fanini-red)]',
    badge: 'bg-[var(--color-fanini-red)] text-white',
  },
  external: {
    name: 'Externe Veranstaltung',
    color: '#6B7280',
    bgColor: 'bg-gray-100',
    borderColor: 'border-gray-300',
    badge: 'bg-gray-500 text-white',
  },
} as const;

export const EVENT_CATEGORY_CONFIG = {
  sport: {
    label: 'Sport',
    icon: '⚽',
    color: 'text-green-600',
  },
  culture: {
    label: 'Kultur',
    icon: '🎭',
    color: 'text-purple-600',
  },
  social: {
    label: 'Soziales',
    icon: '🤝',
    color: 'text-blue-600',
  },
  official: {
    label: 'Offiziell',
    icon: '📋',
    color: 'text-gray-600',
  },
} as const;

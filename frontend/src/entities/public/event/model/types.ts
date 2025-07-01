// frontend/src/entities/public/event/model/types.ts
import type {
  publicEventDetailResponseSchema,
  publicEventDetailSchema,
  publicEventListItemSchema,
  publicEventListResponseSchema,
} from './schemas';
import type { z } from 'zod';

export type PublicEventListItem = z.infer<typeof publicEventListItemSchema>;
export type PublicEventDetail = z.infer<typeof publicEventDetailSchema>;
export type PublicEventListResponse = z.infer<typeof publicEventListResponseSchema>;
export type PublicEventDetailResponse = z.infer<typeof publicEventDetailResponseSchema>;

// Erweiterte Konfigurationen
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

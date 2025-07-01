import type { publicEventSchema, publicEventsResponseSchema } from '@/entities/public/event';

import type z from 'zod';

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
} as const;

// frontend/src/entities/public/event/model/types.ts
export type EventType = 'party' | 'away' | 'meeting' | 'match';

export type PublicEvent = z.infer<typeof publicEventSchema>;
export type PublicEventsResponse = z.infer<typeof publicEventsResponseSchema>;

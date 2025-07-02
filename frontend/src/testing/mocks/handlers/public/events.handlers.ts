// frontend/src/testing/mocks/handlers/public/events.handlers.ts
import { delay, http, HttpResponse } from 'msw';

import type { PublicEventDetail, PublicEventListResponse } from '@/entities/public/event';

import { db, toPublicEventListItem } from '../../db';

// Type-safe converter für Detail
const toPublicEventDetail = (
  dbEvent: NonNullable<ReturnType<typeof db.event.findFirst>>
): PublicEventDetail => {
  const listItem = toPublicEventListItem(dbEvent);

  return {
    ...listItem,
    description: dbEvent.description,
    bannerImage: dbEvent.image ?? undefined,
    registrationRequired: false,
    status: new Date(dbEvent.date) > new Date() ? 'upcoming' : 'completed',
    comments: [],
    history: [
      {
        date: dbEvent.createdAt,
        action: 'created' as const,
        description: 'Event wurde erstellt',
      },
    ],
  };
};

export const eventsHandlers = [
  // GET /api/public/event/list
  http.get('/api/public/event/list', async () => {
    await delay(300);

    const dbEvents = db.event.findMany({
      where: { isPublic: { equals: true } },
      orderBy: { date: 'asc' },
    });

    const events = dbEvents.map(toPublicEventListItem);

    const response: PublicEventListResponse = {
      data: events,
      meta: {
        total: events.length,
        page: 1,
        limit: 10,
        hasMore: false,
      },
    };

    return HttpResponse.json(response);
  }),
];

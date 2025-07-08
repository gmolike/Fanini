/* eslint-disable @typescript-eslint/naming-convention */
// frontend/src/testing/mocks/handlers/public/events.handlers.ts
import { delay, http, HttpResponse } from 'msw';

import type {
  PublicEventDetail,
  PublicEventDetailResponse,
  PublicEventListResponse,
} from '@/entities/public/event';

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

  // GET /api/public/event/:id
  http.get('/api/public/event/:id', async ({ params }) => {
    await delay(200);

    const { id } = params;
    if (typeof id !== 'string') {
      return new HttpResponse(JSON.stringify({ error: 'Invalid ID' }), {
        status: 400,
        headers: { 'content-type': 'application/json' },
      });
    }

    const event = db.event.findFirst({
      where: {
        id: { equals: id },
        isPublic: { equals: true },
      },
    });

    if (!event) {
      return new HttpResponse(JSON.stringify({ error: 'Event nicht gefunden' }), {
        status: 404,
        headers: { 'content-type': 'application/json' },
      });
    }

    const response: PublicEventDetailResponse = {
      data: toPublicEventDetail(event),
    };

    return HttpResponse.json(response);
  }),
];

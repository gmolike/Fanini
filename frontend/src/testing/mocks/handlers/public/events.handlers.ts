// frontend/src/testing/mocks/handlers/events.handlers.ts
import { delay,http, HttpResponse } from 'msw';

import { db, toPublicEvent } from '../../db';

export const eventsHandlers = [
  // GET /api/events/public
  http.get('/api/events/public', async () => {
    await delay(300);

    const dbEvents = db.event.findMany({
      where: { isPublic: { equals: true } },
    });

    const events = dbEvents.map(toPublicEvent);

    return HttpResponse.json({
      data: events,
      meta: {
        total: events.length,
        page: 1,
        limit: 10,
      },
    });
  }),

  // GET /api/events/public/upcoming
  http.get('/api/events/public/upcoming', async () => {
    await delay(200);

    const dbEvents = db.event.findMany({
      where: { isPublic: { equals: true } },
      take: 3,
    });

    const events = dbEvents.map(toPublicEvent);

    return HttpResponse.json({
      data: events,
    });
  }),

  // GET /api/events/public/:id - Ohne explizite Typisierung
  http.get('/api/events/public/:id', async ({ params }) => {
    await delay(200);

    const { id } = params;

    const event = db.event.findFirst({
      where: {
        id: { equals: id as string },
        isPublic: { equals: true },
      },
    });

    if (!event) {
      return new HttpResponse(JSON.stringify({ error: 'Event nicht gefunden' }), {
        status: 404,
        headers: {
          contentType: 'application/json',
        },
      });
    }

    return HttpResponse.json(toPublicEvent(event));
  }),
];

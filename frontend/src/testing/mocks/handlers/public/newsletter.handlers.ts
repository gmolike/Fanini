// frontend/src/testing/mocks/handlers/public/newsletter.handlers.ts
import { http, HttpResponse } from 'msw';

import type {
  NewsletterDetailResponse,
  NewsletterListResponse,
} from '@/entities/public/newsletter';

import {
  createNewsletter,
  toNewsletterListItem,
} from '@/testing/mocks/db/factories/newsletter.factory';

export const newsletterHandlers = [
  // Newsletter List
  http.get('/api/public/newsletter/list', () => {
    const newsletters = Array.from({ length: 10 }, () => createNewsletter());
    const items = newsletters.map(toNewsletterListItem);

    const response: NewsletterListResponse = {
      data: items,
      meta: {
        total: items.length,
        page: 1,
        limit: 10,
        hasMore: false,
      },
    };

    return HttpResponse.json(response);
  }),

  // Newsletter Detail
  http.get('/api/public/newsletter/:id', ({ params }) => {
    const newsletter = createNewsletter({ id: params['id'] as string });

    const response: NewsletterDetailResponse = {
      data: newsletter,
    };

    return HttpResponse.json(response);
  }),

  // Newsletter Subscribe - Fix: request Variable entfernt, da nicht benutzt
  http.post('/api/public/newsletter/subscribe', () => {
    return HttpResponse.json({
      success: true,
      message: 'Erfolgreich angemeldet',
      confirmationRequired: true,
      subscriberId: `sub_${Date.now().toString()}`,
    });
  }),
];

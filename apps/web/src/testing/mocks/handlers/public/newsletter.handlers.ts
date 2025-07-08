// frontend/src/testing/mocks/handlers/public/newsletter.handlers.ts
import { http, HttpResponse } from 'msw';

import type {
  NewsletterDetailResponse,
  NewsletterListResponse,
} from '@/entities/public/newsletter';

import { NEWSLETTER_DATA_MAP, NEWSLETTER_LIST_DATA } from '../../db/seeds/newsletter.seed';

export const newsletterHandlers = [
  // Newsletter List
  http.get('/api/public/newsletter/list', () => {
    const response: NewsletterListResponse = {
      data: NEWSLETTER_LIST_DATA,
      meta: {
        total: NEWSLETTER_LIST_DATA.length,
        page: 1,
        limit: 10,
        hasMore: false,
      },
    };

    return HttpResponse.json(response);
  }),

  // Newsletter Detail
  http.get('/api/public/newsletter/:id', ({ params }) => {
    const newsletterId = params['id'] as string;
    const newsletter = NEWSLETTER_DATA_MAP[newsletterId];

    if (!newsletter) {
      return new HttpResponse(JSON.stringify({ error: 'Newsletter nicht gefunden' }), {
        status: 404,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        headers: { 'content-type': 'application/json' },
      });
    }

    const response: NewsletterDetailResponse = {
      data: newsletter,
    };

    return HttpResponse.json(response);
  }),

  // Newsletter Subscribe
  http.post('/api/public/newsletter/subscribe', () => {
    return HttpResponse.json({
      success: true,
      message: 'Erfolgreich angemeldet',
      confirmationRequired: true,
      subscriberId: `sub_${Date.now().toString()}`,
    });
  }),
];

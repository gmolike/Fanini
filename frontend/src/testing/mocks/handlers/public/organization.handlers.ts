// frontend/src/testing/mocks/handlers/public/organization.handlers.ts
import { delay, http, HttpResponse } from 'msw';

import {
  createGremienListResponse,
  createGremiumDetailResponse,
} from '../../db/seeds/organization.seed';

export const organizationHandlers = [
  // List Handler
  http.get('/api/organization/public/gremien', async () => {
    console.log('[MSW] GET /api/organization/public/gremien');
    await delay(300);
    const response = createGremienListResponse();
    console.log('[MSW] Returning:', response);
    return HttpResponse.json(response);
  }),

  // Detail Handler
  http.get('/api/organization/public/gremien/:gremiumId', async ({ params }) => {
    const gremiumId = params['gremiumId'] as string;
    console.log('[MSW] GET gremium detail:', gremiumId);
    await delay(200);

    try {
      const response = createGremiumDetailResponse(gremiumId as any);
      return HttpResponse.json(response);
    } catch (error) {
      return new HttpResponse(JSON.stringify({ error: 'Gremium nicht gefunden' }), { status: 404 });
    }
  }),
];

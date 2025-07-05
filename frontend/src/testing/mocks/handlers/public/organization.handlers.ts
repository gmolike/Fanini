/* eslint-disable @typescript-eslint/naming-convention */
// frontend/src/testing/mocks/handlers/public/organization.handlers.ts
import { delay, http, HttpResponse } from 'msw';

import type { GremiumType } from '@/entities/public/organization';

import {
  createDocumentsResponse,
  createGremienListResponse,
  GREMIEN_DETAILS,
} from '../../db/seeds/organization.seed';

export const organizationHandlers = [
  // List Handler
  http.get('/api/organization/public/gremien', async () => {
    await delay(300);
    const response = createGremienListResponse();
    return HttpResponse.json(response);
  }),

  // Detail Handler
  http.get('/api/organization/public/gremien/:gremiumId', async ({ params }) => {
    const gremiumId = params['gremiumId'] as string;
    await delay(200);

    // Prüfen ob die ID ein gültiger GremiumType ist
    const validTypes: GremiumType[] = [
      'vorstand',
      'beirat',
      'team_event',
      'team_medien',
      'team_technik',
      'team_verein',
      'kassenpruefung',
    ];

    if (!validTypes.includes(gremiumId as GremiumType)) {
      return new HttpResponse(JSON.stringify({ error: 'Gremium nicht gefunden' }), {
        status: 404,
        headers: { 'content-type': 'application/json' },
      });
    }

    // Direkt auf GREMIEN_DETAILS zugreifen
    const gremium = GREMIEN_DETAILS[gremiumId as GremiumType];

    return HttpResponse.json({ data: gremium });
  }),

  // Documents Handler
  http.get('/api/organization/public/documents', async () => {
    await delay(200);
    const response = createDocumentsResponse();
    return HttpResponse.json(response);
  }),
];

// frontend/src/testing/mocks/handlers/public/teamHistory.handlers.ts
import { delay, http, HttpResponse } from 'msw';

import type {
  AvailableYearsResponse,
  TeamHistoryYearResponse,
} from '@/entities/public/team-history';

import { createAvailableYearsResponse, YEAR_DATA_MAP } from '../../db/seeds/teamHistory.seed';

export const teamHistoryHandlers = [
  // GET /api/team-history/years
  http.get('/api/team-history/years', async () => {
    await delay(200);

    const response: AvailableYearsResponse = createAvailableYearsResponse();
    return HttpResponse.json(response);
  }),

  // GET /api/team-history/:year
  http.get('/api/team-history/:year', async ({ params }) => {
    await delay(300);

    const year = Number(params['year']);

    if (isNaN(year) || !YEAR_DATA_MAP[year]) {
      return new HttpResponse(JSON.stringify({ error: 'Jahr nicht gefunden' }), { status: 404 });
    }

    const response: TeamHistoryYearResponse = YEAR_DATA_MAP[year];
    return HttpResponse.json(response);
  }),
];

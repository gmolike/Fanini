// frontend/src/testing/mocks/handlers/stats.handlers.ts
import { delay,http, HttpResponse } from 'msw';

export const statsHandlers = [
  // GET /api/stats/public
  http.get('/api/stats/public', async () => {
    await delay(200);

    return HttpResponse.json({
      data: {
        memberCount: 156,
        eventsPerYear: 24,
        foundedYear: 2022,
        passionPercentage: 100,
      },
    });
  }),
];

// frontend/src/testing/mocks/handlers/stats.handlers.ts
import { delay, http, HttpResponse } from 'msw';

export const statsHandlers = [
  // GET /api/stats/public
  http.get('/api/stats/public', async () => {
    await delay(200);

    return HttpResponse.json({
      data: {
        memberCount: 70,
        eventsPerYear: 12,
        foundedYear: 2025,
        passionPercentage: 100,
      },
    });
  }),
];

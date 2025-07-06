// frontend/src/testing/mocks/handlers/index.ts
import { http, HttpResponse } from 'msw';

import { creatorHandlers } from './public/creator.handlers';
import { eventsHandlers } from './public/events.handlers';
import { newsletterHandlers } from './public/newsletter.handlers';
import { organizationHandlers } from './public/organization.handlers';
import { statsHandlers } from './public/stats.handlers';
import { teamHistoryHandlers } from './public/teamHistory.handlers';

// Temporärer Test-Handler mit höchster Priorität
const testGalleryHandler = http.get('/api/creators/public/gallery', () => {
  return HttpResponse.json({
    data: [
      {
        id: 'test-work-1',
        creatorId: 'creator-1',
        title: 'Test Work',
        type: 'image',
        fileUrl: 'https://example.com/test.jpg',
        thumbnailUrl: 'https://example.com/test-thumb.jpg',
        createdAt: new Date().toISOString(),
        publishedAt: new Date().toISOString(),
        isPublic: true,
        order: 1,
        tags: ['test'],
        stats: {
          views: 100,
          likes: 10,
        },
      },
    ],
    meta: {
      total: 1,
      hasMore: false,
    },
  });
});

// Handler-Reihenfolge ist wichtig!
export const handlers = [
  testGalleryHandler, // Test handler an erster Stelle
  ...creatorHandlers,
  ...eventsHandlers,
  ...statsHandlers,
  ...organizationHandlers,
  ...teamHistoryHandlers,
  ...newsletterHandlers,
];

// Debug: Zeige alle registrierten Handler

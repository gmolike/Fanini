/* eslint-disable @typescript-eslint/naming-convention */
// frontend/src/testing/mocks/handlers/public/creator.handlers.ts
import { delay, http, HttpResponse } from 'msw';

import type {
  CreatorDetailResponse,
  CreatorsListResponse,
  CreatorWorksResponse,
} from '@/entities/public/creator';

import { CREATORS_DATA, getCreatorWorks, toCreatorListItem } from '../../db/seeds/creator.seed';

const listHandler = http.get('/api/creators/public/list', async () => {
  await delay(300);

  const activeCreators = CREATORS_DATA.filter(creator => creator.isActive);
  const listItems = activeCreators.map(toCreatorListItem);

  const response: CreatorsListResponse = {
    data: listItems,
    meta: {
      total: listItems.length,
      types: ['grafik', 'foto', 'video', 'musik', 'other'],
    },
  };

  return HttpResponse.json(response);
});

const detailHandler = http.get('/api/creators/public/:creatorId', async ({ params }) => {
  await delay(200);

  const creatorId = params['creatorId'] as string;
  const creator = CREATORS_DATA.find(c => c.id === creatorId);

  if (!creator?.isActive) {
    return new HttpResponse(JSON.stringify({ error: 'Creator nicht gefunden' }), {
      status: 404,
      headers: { 'content-type': 'application/json' },
    });
  }

  const response: CreatorDetailResponse = {
    data: creator,
  };

  return HttpResponse.json(response);
});

const worksHandler = http.get(
  '/api/creators/public/:creatorId/works',
  async ({ request, params }) => {
    await delay(300);

    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page')) || 1;
    const limit = Number(url.searchParams.get('limit')) || 12;
    const creatorId = params['creatorId'] as string;

    const creator = CREATORS_DATA.find(c => c.id === creatorId);
    if (!creator?.isActive) {
      return new HttpResponse(JSON.stringify({ error: 'Creator nicht gefunden' }), {
        status: 404,
        headers: { 'content-type': 'application/json' },
      });
    }

    const response: CreatorWorksResponse = getCreatorWorks(creatorId, page, limit);
    return HttpResponse.json(response);
  }
);

// Gallery Handler mit mehr Debug-Info
const galleryHandler = http.get('/api/creators/public/gallery', async () => {
  await delay(400);

  // Vereinfachte Response zum Testen
  const testResponse: CreatorWorksResponse = {
    data: [
      {
        id: 'test-work-1',
        creatorId: 'creator-1',
        title: 'Test Work',
        type: 'image',
        fileUrl: 'https://images.unsplash.com/photo-1569163139394-de4798aa0a08?w=800',
        thumbnailUrl: 'https://images.unsplash.com/photo-1569163139394-de4798aa0a08?w=400',
        createdAt: '2024-01-01T10:00:00Z',
        publishedAt: '2024-01-02T10:00:00Z',
        isPublic: true,
        order: 1,
        tags: [],
        stats: {
          views: 0,
          likes: 0,
        },
      },
    ],
    meta: {
      total: 1,
      hasMore: false,
    },
  };

  console.log('[MSW] Returning test response:', testResponse);
  return HttpResponse.json(testResponse);
});

export const creatorHandlers = [listHandler, detailHandler, worksHandler, galleryHandler];

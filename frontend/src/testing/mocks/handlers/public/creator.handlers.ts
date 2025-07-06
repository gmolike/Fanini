/* eslint-disable @typescript-eslint/naming-convention */
// frontend/src/testing/mocks/handlers/public/creator.handlers.ts
import { delay, http, HttpResponse } from 'msw';

import type {
  CreatorDetailResponse,
  CreatorsListResponse,
  CreatorWorksResponse,
} from '@/entities/public/creator';

import {
  CREATORS_DATA,
  CREATOR_WORKS_DATA,
  getCreatorWorks,
  toCreatorListItem,
} from '../../db/seeds/creator.seed';

console.log('[MSW] Loading creator handlers...');
console.log('[MSW] CREATOR_WORKS_DATA:', CREATOR_WORKS_DATA);

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

// Gallery Handler mit robuster Fehlerbehandlung
const galleryHandler = http.get('/api/creators/public/gallery', async () => {
  console.log('[MSW] Gallery handler called!');
  await delay(400);

  try {
    // Sicherstellen, dass CREATOR_WORKS_DATA verfügbar ist
    if (!CREATOR_WORKS_DATA || !Array.isArray(CREATOR_WORKS_DATA)) {
      console.error('[MSW] CREATOR_WORKS_DATA is not available or not an array');
      return HttpResponse.json({
        data: [],
        meta: {
          total: 0,
          hasMore: false,
        },
      });
    }

    // Direkt die gefilterten Werke zurückgeben
    const publicWorks = CREATOR_WORKS_DATA.filter(work => {
      return work && work.isPublic === true;
    });

    console.log('[MSW] Filtered public works:', publicWorks.length);

    // Sortieren nach publishedAt, aber mit Null-Check
    const sortedWorks = publicWorks.sort((a, b) => {
      const dateA = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
      const dateB = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
      return dateB - dateA;
    });

    const response: CreatorWorksResponse = {
      data: sortedWorks,
      meta: {
        total: sortedWorks.length,
        hasMore: false,
      },
    };

    console.log('[MSW] Returning gallery response with', sortedWorks.length, 'works');
    return HttpResponse.json(response);
  } catch (error) {
    console.error('[MSW] Error in gallery handler:', error);
    // Trotzdem eine valide Antwort zurückgeben
    return HttpResponse.json({
      data: [],
      meta: {
        total: 0,
        hasMore: false,
      },
    });
  }
});

export const creatorHandlers = [listHandler, detailHandler, worksHandler, galleryHandler];

console.log('[MSW] Creator handlers exported:', creatorHandlers.length);

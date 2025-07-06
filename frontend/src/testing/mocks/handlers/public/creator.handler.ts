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
  getCreatorWorks,
  getGalleryWorks,
  toCreatorListItem,
} from '../../db/seeds/creator.seed';

export const creatorHandlers = [
  // GET /api/creators/public/list
  http.get('/api/creators/public/list', async () => {
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
  }),

  // GET /api/creators/public/:creatorId
  http.get('/api/creators/public/:creatorId', async ({ params }) => {
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
  }),

  // GET /api/creators/public/:creatorId/works
  http.get('/api/creators/public/:creatorId/works', async ({ request, params }) => {
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
  }),

  // GET /api/creators/public/gallery
  http.get('/api/creators/public/gallery', async () => {
    await delay(400);

    const response: CreatorWorksResponse = getGalleryWorks();
    return HttpResponse.json(response);
  }),
];

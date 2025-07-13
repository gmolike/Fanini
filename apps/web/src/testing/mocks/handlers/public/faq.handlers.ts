/* eslint-disable @typescript-eslint/naming-convention */
// frontend/src/testing/mocks/handlers/public/faq.handlers.ts
import { delay, http, HttpResponse } from 'msw';

import type { FaqCategory } from '@/entities/public/faq';

import { createFaqListResponse, FAQ_DATA, getFaqsByCategory } from '../../db/seeds/faq.seed';

export const faqHandlers = [
  // GET /api/public/faq
  http.get('/api/public/faq', async ({ request }) => {
    await delay(200);

    const url = new URL(request.url);
    const category = url.searchParams.get('category') as FaqCategory | null;

    if (category) {
      const filteredFaqs = getFaqsByCategory(category);
      return HttpResponse.json({
        data: filteredFaqs,
        meta: {
          total: filteredFaqs.length,
          categories: ['mitgliedschaft', 'events', 'verein', 'technik', 'sonstige'],
        },
      });
    }

    const response = createFaqListResponse();
    return HttpResponse.json(response);
  }),

  // GET /api/public/faq/:id
  http.get('/api/public/faq/:id', async ({ params }) => {
    await delay(150);

    const faqId = params['id'] as string;
    const faq = FAQ_DATA.find(f => f.id === faqId);

    if (!faq) {
      return new HttpResponse(JSON.stringify({ error: 'FAQ nicht gefunden' }), {
        status: 404,
        headers: { 'content-type': 'application/json' },
      });
    }

    // Increment view count simulation
    faq.views += 1;

    return HttpResponse.json({ data: faq });
  }),

  // GET /api/public/faq/popular
  http.get('/api/public/faq/popular', async () => {
    await delay(150);

    const popularFaqs = FAQ_DATA.filter(faq => faq.isPopular)
      .sort((a, b) => b.views - a.views)
      .slice(0, 5);

    return HttpResponse.json({
      data: popularFaqs,
      meta: {
        total: popularFaqs.length,
      },
    });
  }),

  // POST /api/public/faq/:id/helpful
  http.post('/api/public/faq/:id/helpful', async ({ params }) => {
    await delay(100);

    const faqId = params['id'] as string;
    const faq = FAQ_DATA.find(f => f.id === faqId);

    if (!faq) {
      return new HttpResponse(JSON.stringify({ error: 'FAQ nicht gefunden' }), {
        status: 404,
        headers: { 'content-type': 'application/json' },
      });
    }

    return HttpResponse.json({
      success: true,
      message: 'Vielen Dank für dein Feedback!',
    });
  }),

  // GET /api/public/faq/search
  http.get('/api/public/faq/search', async ({ request }) => {
    await delay(300);

    const url = new URL(request.url);
    const query = url.searchParams.get('q')?.toLowerCase() ?? '';

    if (!query) {
      return HttpResponse.json({
        data: [],
        meta: { total: 0, query },
      });
    }

    const results = FAQ_DATA.filter(
      faq =>
        faq.question.toLowerCase().includes(query) ||
        faq.answer.toLowerCase().includes(query) ||
        faq.tags?.some(tag => tag.toLowerCase().includes(query))
    );

    return HttpResponse.json({
      data: results,
      meta: {
        total: results.length,
        query,
      },
    });
  }),
];

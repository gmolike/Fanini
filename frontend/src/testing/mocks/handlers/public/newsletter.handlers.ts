// frontend/src/testing/mocks/handlers/public/newsletter.handlers.ts
import { delay, http, HttpResponse } from 'msw';

import type {
  NewsletterDetailResponse,
  NewsletterListResponse,
} from '@/entities/public/newsletter';

import { db, toNewsletterDetail, toNewsletterListItem } from '../../db';

export const newsletterHandlers = [
  // GET /api/public/newsletter/list
  http.get('/api/public/newsletter/list', async ({ request }) => {
    await delay(300);

    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page') ?? '1');
    const limit = Number(url.searchParams.get('limit') ?? '10');

    const newsletters = db.newsletter.findMany({
      where: { status: { equals: 'published' } },
      orderBy: { publishedAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    });

    const total = db.newsletter.count({
      where: { status: { equals: 'published' } },
    });

    const items = newsletters.map(toNewsletterListItem);

    const response: NewsletterListResponse = {
      data: items,
      meta: {
        total,
        page,
        limit,
        hasMore: page * limit < total,
      },
    };

    return HttpResponse.json(response);
  }),

  // GET /api/public/newsletter/:id
  http.get('/api/public/newsletter/:id', async ({ params }) => {
    await delay(200);

    const { id } = params;
    if (typeof id !== 'string') {
      return new HttpResponse(JSON.stringify({ error: 'Invalid ID' }), {
        status: 400,
        headers: { 'content-type': 'application/json' },
      });
    }

    const newsletter = db.newsletter.findFirst({
      where: {
        id: { equals: id },
        status: { equals: 'published' },
      },
    });

    if (!newsletter) {
      return new HttpResponse(JSON.stringify({ error: 'Newsletter nicht gefunden' }), {
        status: 404,
        headers: { 'content-type': 'application/json' },
      });
    }

    // Author holen
    const author = db.newsletterAuthor.findFirst({
      where: { id: { equals: newsletter.authorId } },
    });

    if (!author) {
      return new HttpResponse(JSON.stringify({ error: 'Author nicht gefunden' }), {
        status: 500,
        headers: { 'content-type': 'application/json' },
      });
    }

    // Artikel holen
    const articles = db.newsletterArticle.findMany({
      where: {
        id: {
          in: [
            'article-esports-recap',
            'article-baller-league',
            'article-vorstand',
            'article-mitglieder',
            'article-technik',
            'article-medien',
            'article-events',
            'article-fan-week',
            'article-community',
            'article-upcoming',
          ],
        },
      },
      orderBy: { order: 'asc' },
    });

    const response: NewsletterDetailResponse = {
      data: toNewsletterDetail(newsletter, author, articles),
    };

    return HttpResponse.json(response);
  }),

  // POST /api/public/newsletter/subscribe
  http.post('/api/public/newsletter/subscribe', async ({ request }) => {
    await delay(500);

    const body = (await request.json()) as {
      email: string;
      firstName: string;
      lastName?: string;
      acceptsMarketing: boolean;
    };

    // Validierung
    if (!body.email || !body.firstName || !body.acceptsMarketing) {
      return new HttpResponse(JSON.stringify({ error: 'Fehlende Pflichtfelder' }), {
        status: 400,
        headers: { 'content-type': 'application/json' },
      });
    }

    // Prüfen ob Email bereits existiert
    const existing = db.newsletterSubscription.findFirst({
      where: { email: { equals: body.email } },
    });

    if (existing) {
      return new HttpResponse(JSON.stringify({ error: 'E-Mail-Adresse bereits registriert' }), {
        status: 409,
        headers: { 'content-type': 'application/json' },
      });
    }

    // Neue Subscription erstellen
    const subscription = db.newsletterSubscription.create({
      id: `sub-${Date.now()}`,
      email: body.email,
      firstName: body.firstName,
      lastName: body.lastName,
      acceptsMarketing: body.acceptsMarketing,
      subscribedAt: new Date().toISOString(),
      confirmed: false,
      confirmationToken: Math.random().toString(36).substring(2, 15),
    });

    return HttpResponse.json({
      success: true,
      message: 'Erfolgreich für den Newsletter angemeldet. Bitte bestätige deine E-Mail-Adresse.',
      data: {
        id: subscription.id,
        email: subscription.email,
      },
    });
  }),
];

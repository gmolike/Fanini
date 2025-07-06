/* eslint-disable @typescript-eslint/naming-convention */
// frontend/src/testing/mocks/handlers/public/document.handlers.ts
import { delay, http, HttpResponse } from 'msw';

import type { DocumentCategory } from '@/entities/public/document';

import {
  createDocumentListResponse,
  DOCUMENTS_DATA,
  getDocumentsByCategory,
  getFeaturedDocuments,
  getOrganisationsstruktur,
  getSatzung,
  getWerteleitbild,
} from '../../db/seeds/document.seed';

export const documentHandlers = [
  // GET /api/public/documents
  http.get('/api/public/documents', async ({ request }) => {
    await delay(250);

    const url = new URL(request.url);
    const category = url.searchParams.get('category') as DocumentCategory | null;
    const featured = url.searchParams.get('featured') === 'true';

    if (featured) {
      const featuredDocs = getFeaturedDocuments();
      return HttpResponse.json({
        data: featuredDocs,
        meta: {
          total: featuredDocs.length,
          categories: [...new Set(featuredDocs.map(doc => doc.category))],
        },
      });
    }

    if (category) {
      const categoryDocs = getDocumentsByCategory(category);
      return HttpResponse.json({
        data: categoryDocs,
        meta: {
          total: categoryDocs.length,
          categories: [category],
        },
      });
    }

    const response = createDocumentListResponse();
    return HttpResponse.json(response);
  }),

  // GET /api/public/documents/:id
  http.get('/api/public/documents/:id', async ({ params }) => {
    await delay(200);

    const documentId = params['id'] as string;
    const document = DOCUMENTS_DATA.find(doc => doc.id === documentId);

    if (!document) {
      return new HttpResponse(JSON.stringify({ error: 'Dokument nicht gefunden' }), {
        status: 404,
        headers: { 'content-type': 'application/json' },
      });
    }

    // Increment download count simulation
    document.downloads += 1;

    return HttpResponse.json({ data: document });
  }),

  // GET /api/public/documents/category/:category
  http.get('/api/public/documents/category/:category', async ({ params }) => {
    await delay(200);

    const category = params['category'] as DocumentCategory;

    // Special handling for important documents
    if (category === 'satzung') {
      const satzung = getSatzung();
      if (satzung) {
        return HttpResponse.json({ data: satzung });
      }
    }

    const documents = getDocumentsByCategory(category);

    if (documents.length === 0) {
      return new HttpResponse(JSON.stringify({ error: 'Keine Dokumente in dieser Kategorie' }), {
        status: 404,
        headers: { 'content-type': 'application/json' },
      });
    }

    // Return the first document if multiple exist
    return HttpResponse.json({ data: documents[0] });
  }),

  // GET /api/public/documents/special/:type
  http.get('/api/public/documents/special/:type', async ({ params }) => {
    await delay(150);

    const type = params['type'] as string;
    let document;

    switch (type) {
      case 'satzung':
        document = getSatzung();
        break;
      case 'werteleitbild':
        document = getWerteleitbild();
        break;
      case 'organisationsstruktur':
        document = getOrganisationsstruktur();
        break;
      default:
        return new HttpResponse(JSON.stringify({ error: 'Unbekannter Dokumenttyp' }), {
          status: 400,
          headers: { 'content-type': 'application/json' },
        });
    }

    if (!document) {
      return new HttpResponse(JSON.stringify({ error: 'Dokument nicht gefunden' }), {
        status: 404,
        headers: { 'content-type': 'application/json' },
      });
    }

    return HttpResponse.json({ data: document });
  }),

  // POST /api/public/documents/:id/download
  http.post('/api/public/documents/:id/download', async ({ params }) => {
    await delay(100);

    const documentId = params['id'] as string;
    const document = DOCUMENTS_DATA.find(doc => doc.id === documentId);

    if (!document) {
      return new HttpResponse(JSON.stringify({ error: 'Dokument nicht gefunden' }), {
        status: 404,
        headers: { 'content-type': 'application/json' },
      });
    }

    // Track download
    document.downloads += 1;

    return HttpResponse.json({
      success: true,
      downloadUrl: document.fileUrl,
      fileName: `${document.title.replace(/\s+/g, '_')}.pdf`,
    });
  }),

  // GET /api/public/documents/search
  http.get('/api/public/documents/search', async ({ request }) => {
    await delay(300);

    const url = new URL(request.url);
    const query = url.searchParams.get('q')?.toLowerCase() ?? '';

    if (!query) {
      return HttpResponse.json({
        data: [],
        meta: { total: 0, query },
      });
    }

    const results = DOCUMENTS_DATA.filter(
      doc =>
        doc.status === 'current' &&
        (doc.title.toLowerCase().includes(query) ||
          // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
          doc.description?.toLowerCase().includes(query) ||
          doc.tags?.some(tag => tag.toLowerCase().includes(query)))
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

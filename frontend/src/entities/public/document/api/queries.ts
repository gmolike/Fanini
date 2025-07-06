// frontend/src/entities/public/document/api/queries.ts
import z from 'zod';

import { createRemoteQuery, createSimpleRemoteQuery } from '@/shared/api';

import { documentListResponseSchema, documentSchema } from '../model/schemas';

import type { Document, DocumentCategory, DocumentListItem } from '../model/types';

// Liste aller Dokumente
export const useDocumentList = createSimpleRemoteQuery<{
  data: DocumentListItem[];
  meta: { total: number; categories: string[] };
}>({
  queryKey: ['documents', 'list'],
  endpoint: '/api/public/documents',
  schema: documentListResponseSchema,
  staleTime: 1000 * 60 * 30, // 30 minutes
});

// Einzelnes Dokument nach ID
// Type für wrapped response
type ApiResponse<T> = {
  data: T;
};

// Einzelnes Dokument nach ID - mit korrektem Type
export const useDocumentDetail = createRemoteQuery<
  ApiResponse<Document>,
  { documentId: string; enabled?: boolean }
>({
  queryKey: ({ documentId }) => ['documents', 'detail', documentId],
  endpoint: ({ documentId }) => `/api/public/documents/${documentId}`,
  schema: z.object({ data: documentSchema }),
  staleTime: 1000 * 60 * 60,
  enabled: ({ documentId, enabled = true }) => !!documentId && enabled,
});
// Dokument nach Kategorie
export const useDocumentByCategory = createRemoteQuery<Document, { category: DocumentCategory }>({
  queryKey: ({ category }) => ['documents', 'category', category],
  endpoint: ({ category }) => `/api/public/documents/category/${category}`,
  schema: documentSchema,
  staleTime: 1000 * 60 * 60 * 24, // 24 hours für Satzung etc.
});

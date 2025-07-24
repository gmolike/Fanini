// entities/public/document/api/queries.ts
import { z } from 'zod';

import { createRemoteQuery, createSimpleRemoteQuery } from '@/shared/api';
import { API_ROUTES } from '@/shared/api/constants';

import { documentListResponseSchema, documentSchema } from '../model/schemas';

import type { Document, DocumentCategory, DocumentListItem } from '../model/types';

export const useDocumentList = createSimpleRemoteQuery<{
  data: DocumentListItem[];
  meta: { total: number; categories: string[] };
}>({
  queryKey: ['documents', 'list'],
  endpoint: API_ROUTES.PUBLIC.DOCUMENTS.LIST,
  schema: documentListResponseSchema,
  staleTime: 1000 * 60 * 30,
});

type DocumentDetailResponse = {
  data: Document;
};

export const useDocumentDetail = createRemoteQuery<
  DocumentDetailResponse,
  { documentId: string; enabled?: boolean }
>({
  queryKey: ({ documentId }) => ['documents', 'detail', documentId],
  endpoint: ({ documentId }) => API_ROUTES.PUBLIC.DOCUMENTS.DETAIL(documentId),
  schema: z.object({ data: documentSchema }),
  staleTime: 1000 * 60 * 60,
  enabled: ({ documentId, enabled = true }) => !!documentId && enabled,
});

export const useDocumentByCategory = createRemoteQuery<Document, { category: DocumentCategory }>({
  queryKey: ({ category }) => ['documents', 'category', category],
  endpoint: ({ category }) => API_ROUTES.PUBLIC.DOCUMENTS.BY_CATEGORY(category),
  schema: documentSchema,
  staleTime: 1000 * 60 * 60 * 24,
});

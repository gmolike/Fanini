// frontend/src/entities/public/document/api/queries.ts
import { useQuery, type UseQueryResult } from '@tanstack/react-query';

import { apiClient } from '@/shared/api';

import { documentListResponseSchema, documentSchema } from '../model/schemas';

import type { Document, DocumentCategory, DocumentListItem } from '../model/types';

export const useDocumentList = (): UseQueryResult<{
  data: DocumentListItem[];
  meta: { total: number; categories: string[] };
}> => {
  return useQuery({
    queryKey: ['documents', 'list'],
    queryFn: async () => {
      const response = await apiClient.get('/api/public/documents');
      return documentListResponseSchema.parse(response);
    },
    staleTime: 1000 * 60 * 30, // 30 minutes
  });
};

export const useDocumentDetail = (documentId: string | undefined): UseQueryResult<Document> => {
  return useQuery({
    queryKey: ['documents', 'detail', documentId ?? ''],
    queryFn: async () => {
      if (!documentId) throw new Error('Document ID is required');
      const response = await apiClient.get(`/api/public/documents/${documentId}`);
      return documentSchema.parse(response);
    },
    enabled: !!documentId,
    staleTime: 1000 * 60 * 60, // 1 hour
  });
};

export const useDocumentByCategory = (category: DocumentCategory): UseQueryResult<Document> => {
  return useQuery({
    queryKey: ['documents', 'category', category],
    queryFn: async () => {
      const response = await apiClient.get(`/api/public/documents/category/${category}`);
      return documentSchema.parse(response);
    },
    staleTime: 1000 * 60 * 60 * 24, // 24 hours für Satzung etc.
  });
};

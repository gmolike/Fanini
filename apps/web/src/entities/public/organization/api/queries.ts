// entities/public/organization/api/queries.ts
import { createRemoteQuery, createSimpleRemoteQuery } from '@/shared/api';

import {
  documentsResponseSchema,
  gremienListResponseSchema,
  gremiumDetailResponseSchema,
} from '../model/schemas';

import type { DocumentsResponse, GremienListResponse, GremiumDetailResponse } from '../model/types';

// Simple Queries - diese funktionieren bereits
export const useGremienList = createSimpleRemoteQuery<GremienListResponse>({
  queryKey: ['organization', 'gremien', 'list'],
  endpoint: '/api/organization/public/gremien',
  schema: gremienListResponseSchema,
  staleTime: 1000 * 60 * 10,
});

export const useOrganizationDocuments = createSimpleRemoteQuery<DocumentsResponse>({
  queryKey: ['organization', 'documents', 'public'],
  endpoint: '/api/organization/public/documents',
  schema: documentsResponseSchema,
  staleTime: 1000 * 60 * 5,
});

// Für parametrisierte Queries verwende createRemoteQuery
type GremiumDetailParams = {
  gremiumId: string;
};

export const useGremiumDetail = createRemoteQuery<GremiumDetailResponse, GremiumDetailParams>({
  queryKey: ({ gremiumId }) => ['organization', 'gremium', gremiumId],
  endpoint: ({ gremiumId }) => `/api/organization/public/gremien/${gremiumId}`,
  schema: gremiumDetailResponseSchema,
  staleTime: 1000 * 60 * 10,
  enabled: ({ gremiumId }) => !!gremiumId,
});

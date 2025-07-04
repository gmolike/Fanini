// entities/public/organization/api/queries.ts
import { createSimpleRemoteQuery } from '@/shared/api';

import {
  documentsResponseSchema,
  gremienListResponseSchema,
  gremiumDetailResponseSchema,
} from '../model/schemas';

import type { DocumentsResponse, GremienListResponse, GremiumDetailResponse } from '../model/types';

export const useGremienList = createSimpleRemoteQuery<GremienListResponse>({
  queryKey: ['organization', 'gremien', 'list'],
  endpoint: '/api/organization/public/gremien',
  schema: gremienListResponseSchema,
  staleTime: 1000 * 60 * 10,
});

export const useGremiumDetail = (gremiumId: string) =>
  createSimpleRemoteQuery<GremiumDetailResponse>({
    queryKey: ['organization', 'gremium', gremiumId],
    endpoint: `/api/organization/public/gremien/${gremiumId}`,
    schema: gremiumDetailResponseSchema,
    staleTime: 1000 * 60 * 10,
    enabled: !!gremiumId,
  });

export const useOrganizationDocuments = createSimpleRemoteQuery<DocumentsResponse>({
  queryKey: ['organization', 'documents', 'public'],
  endpoint: '/api/organization/public/documents',
  schema: documentsResponseSchema,
  staleTime: 1000 * 60 * 5,
});

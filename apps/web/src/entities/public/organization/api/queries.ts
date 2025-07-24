// entities/public/organization/api/queries.ts
import { createRemoteQuery, createSimpleRemoteQuery } from '@/shared/api';
import { API_ROUTES } from '@/shared/api/constants';

import {
  documentsResponseSchema,
  gremienListResponseSchema,
  gremiumDetailResponseSchema,
} from '../model/schemas';

import type { DocumentsResponse, GremienListResponse, GremiumDetailResponse } from '../model/types';

export const useGremienList = createSimpleRemoteQuery<GremienListResponse>({
  queryKey: ['organization', 'gremien', 'list'],
  endpoint: API_ROUTES.PUBLIC.ORGANIZATION.GREMIEN.LIST,
  schema: gremienListResponseSchema,
  staleTime: 1000 * 60 * 10,
});

export const useOrganizationDocuments = createSimpleRemoteQuery<DocumentsResponse>({
  queryKey: ['organization', 'documents', 'public'],
  endpoint: API_ROUTES.PUBLIC.ORGANIZATION.DOCUMENTS,
  schema: documentsResponseSchema,
  staleTime: 1000 * 60 * 5,
});

type GremiumDetailParams = {
  gremiumId: string;
};

export const useGremiumDetail = createRemoteQuery<GremiumDetailResponse, GremiumDetailParams>({
  queryKey: ({ gremiumId }) => ['organization', 'gremium', gremiumId],
  endpoint: ({ gremiumId }) => API_ROUTES.PUBLIC.ORGANIZATION.GREMIEN.DETAIL(gremiumId),
  schema: gremiumDetailResponseSchema,
  staleTime: 1000 * 60 * 10,
  enabled: ({ gremiumId }) => !!gremiumId,
});

// entities/public/creator/api/queries.ts
import { createRemoteQuery, createSimpleRemoteQuery } from '@/shared/api';

import {
  creatorDetailResponseSchema,
  creatorsListResponseSchema,
  creatorWorksResponseSchema,
} from '../model/schemas';

import type {
  CreatorDetailResponse,
  CreatorsListResponse,
  CreatorWorksResponse,
} from '../model/types';

// Liste aller Creator
export const useCreatorsList = createSimpleRemoteQuery<CreatorsListResponse>({
  queryKey: ['creators', 'list'],
  endpoint: '/api/creators/public/list',
  schema: creatorsListResponseSchema,
  staleTime: 1000 * 60 * 5,
});

// Creator Detail
type CreatorDetailParams = {
  creatorId: string;
};

export const useCreatorDetail = createRemoteQuery<CreatorDetailResponse, CreatorDetailParams>({
  queryKey: ({ creatorId }) => ['creators', 'detail', creatorId],
  endpoint: ({ creatorId }) => `/api/creators/public/${creatorId}`,
  schema: creatorDetailResponseSchema,
  staleTime: 1000 * 60 * 10,
  enabled: ({ creatorId }) => !!creatorId,
});

// Creator Werke
type CreatorWorksParams = {
  creatorId: string;
  page?: number;
  limit?: number;
};

export const useCreatorWorks = createRemoteQuery<CreatorWorksResponse, CreatorWorksParams>({
  queryKey: ({ creatorId, page = 1 }) => ['creators', 'works', creatorId, page],
  endpoint: ({ creatorId, page = 1, limit = 12 }) =>
    `/api/creators/public/${creatorId}/works?page=${String(page)}&limit=${String(limit)}`,
  schema: creatorWorksResponseSchema,
  staleTime: 1000 * 60 * 5,
  enabled: ({ creatorId }) => !!creatorId,
});

// Alle Werke für Galerie
export const useGalleryWorks = createSimpleRemoteQuery<CreatorWorksResponse>({
  queryKey: ['creators', 'gallery', 'all'],
  endpoint: '/api/creators/public/gallery',
  schema: creatorWorksResponseSchema,
  staleTime: 1000 * 60 * 5,
});

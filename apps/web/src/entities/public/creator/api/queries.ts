// entities/public/creator/api/queries.ts
import { createRemoteQuery, createSimpleRemoteQuery } from '@/shared/api';
import { API_ROUTES } from '@/shared/api/constants';

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

export const useCreatorsList = createSimpleRemoteQuery<CreatorsListResponse>({
  queryKey: ['creators', 'list'],
  endpoint: API_ROUTES.PUBLIC.CREATORS.LIST,
  schema: creatorsListResponseSchema,
  staleTime: 1000 * 60 * 5,
});

type CreatorDetailParams = {
  creatorId: string;
};

export const useCreatorDetail = createRemoteQuery<CreatorDetailResponse, CreatorDetailParams>({
  queryKey: ({ creatorId }) => ['creators', 'detail', creatorId],
  endpoint: ({ creatorId }) => API_ROUTES.PUBLIC.CREATORS.DETAIL(creatorId),
  schema: creatorDetailResponseSchema,
  staleTime: 1000 * 60 * 10,
  enabled: ({ creatorId }) => !!creatorId,
});

type CreatorWorksParams = {
  creatorId: string;
  page?: number;
  limit?: number;
};

export const useCreatorWorks = createRemoteQuery<CreatorWorksResponse, CreatorWorksParams>({
  queryKey: ({ creatorId, page = 1 }) => ['creators', 'works', creatorId, page],
  endpoint: ({ creatorId, page = 1, limit = 12 }) =>
    API_ROUTES.PUBLIC.CREATORS.WORKS(creatorId, page, limit),
  schema: creatorWorksResponseSchema,
  staleTime: 1000 * 60 * 5,
  enabled: ({ creatorId }) => !!creatorId,
});

export const useGalleryWorks = createSimpleRemoteQuery<CreatorWorksResponse>({
  queryKey: ['creators', 'gallery', 'all'],
  endpoint: API_ROUTES.PUBLIC.CREATORS.GALLERY,
  schema: creatorWorksResponseSchema,
  staleTime: 1000 * 60 * 5,
});

// frontend/src/entities/public/event/api/queries.ts
import { createSimpleRemoteQuery } from '@/shared/api';

import { publicEventDetailResponseSchema, publicEventListResponseSchema } from '../model/schemas';

import type { PublicEventDetailResponse, PublicEventListResponse } from '../model/types';

// NEUE QUERIES
export const usePublicEventList = createSimpleRemoteQuery<PublicEventListResponse>({
  queryKey: ['events', 'public', 'list'],
  endpoint: '/api/public/event/list',
  schema: publicEventListResponseSchema,
  staleTime: 1000 * 60 * 5,
});

export const usePublicEventDetail = (eventId: string | null, options?: { enabled?: boolean }) =>
  createSimpleRemoteQuery<PublicEventDetailResponse>({
    queryKey: ['events', 'public', 'detail', eventId ?? ''],
    endpoint: eventId ? `/api/public/event/${eventId}` : '/api/public/event/',
    schema: publicEventDetailResponseSchema,
    staleTime: 1000 * 60 * 10,
    enabled: !!eventId && options?.enabled !== false,
    ...options,
  });

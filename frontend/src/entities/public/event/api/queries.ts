// frontend/src/entities/public/event/api/queries.ts
import { createSimpleRemoteQuery } from '@/shared/api';

import { publicEventDetailResponseSchema, publicEventListResponseSchema } from '../model/schemas';

import type { PublicEventDetailResponse, PublicEventListResponse } from '../model/types';

export const usePublicEventList = createSimpleRemoteQuery<PublicEventListResponse>({
  queryKey: ['events', 'public', 'list'],
  endpoint: '/api/public/event/list',
  schema: publicEventListResponseSchema,
  staleTime: 1000 * 60 * 5,
});

export const usePublicEventDetail = (eventId: string | null, options?: { enabled?: boolean }) =>
  createSimpleRemoteQuery<PublicEventDetailResponse>({
    queryKey: ['events', 'public', 'detail', eventId],
    endpoint: `/api/public/event/${eventId}`,
    schema: publicEventDetailResponseSchema,
    staleTime: 1000 * 60 * 10,
    ...options,
  });

// Die alten Queries umbenennen für Rückwärtskompatibilität
export const usePublicEvents = usePublicEventList;
export const useUpcomingEvents = createSimpleRemoteQuery<PublicEventListResponse>({
  queryKey: ['events', 'public', 'upcoming'],
  endpoint: '/api/public/event/upcoming',
  schema: publicEventListResponseSchema,
  staleTime: 1000 * 60 * 5,
});

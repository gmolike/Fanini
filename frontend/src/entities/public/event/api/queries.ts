// entities/public/event/api/queries.ts
import { createRemoteQuery, createSimpleRemoteQuery } from '@/shared/api';

import { publicEventDetailResponseSchema, publicEventListResponseSchema } from '../model/schemas';

import type { PublicEventDetailResponse, PublicEventListResponse } from '../model/types';

// Simple Query für Event List
export const usePublicEventList = createSimpleRemoteQuery<PublicEventListResponse>({
  queryKey: ['events', 'public', 'list'],
  endpoint: '/api/public/event/list',
  schema: publicEventListResponseSchema,
  staleTime: 1000 * 60 * 5,
});

// Parametrisierte Query für Event Detail - analog zu useGremiumDetail
type EventDetailParams = {
  eventId: string;
};

export const usePublicEventDetail = createRemoteQuery<PublicEventDetailResponse, EventDetailParams>(
  {
    queryKey: ({ eventId }) => ['events', 'public', 'detail', eventId],
    endpoint: ({ eventId }) => `/api/public/event/${eventId}`,
    schema: publicEventDetailResponseSchema,
    staleTime: 1000 * 60 * 10,
    enabled: ({ eventId }) => !!eventId,
  }
);

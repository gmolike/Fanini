// entities/public/event/api/queries.ts
import { createRemoteQuery, createSimpleRemoteQuery } from '@/shared/api';
import { API_ROUTES } from '@/shared/api/constants';

import { publicEventDetailResponseSchema, publicEventListResponseSchema } from '../model/schemas';

import type { PublicEventDetailResponse, PublicEventListResponse } from '../model/types';

export const usePublicEventList = createSimpleRemoteQuery<PublicEventListResponse>({
  queryKey: ['events', 'public', 'list'],
  endpoint: API_ROUTES.PUBLIC.EVENTS.LIST,
  schema: publicEventListResponseSchema,
  staleTime: 1000 * 60 * 5,
});

type EventDetailParams = {
  eventId: string;
};

export const usePublicEventDetail = createRemoteQuery<PublicEventDetailResponse, EventDetailParams>(
  {
    queryKey: ({ eventId }) => ['events', 'public', 'detail', eventId],
    endpoint: ({ eventId }) => API_ROUTES.PUBLIC.EVENTS.DETAIL(eventId),
    schema: publicEventDetailResponseSchema,
    staleTime: 1000 * 60 * 10,
    enabled: ({ eventId }) => !!eventId,
  }
);

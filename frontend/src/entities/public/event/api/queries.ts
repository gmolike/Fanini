// frontend/src/entities/public/event/api/queries.ts
import { createSimpleRemoteQuery } from '@/shared/api';

import { publicEventsResponseSchema } from '../model/schemas';

import type { PublicEventsResponse } from '../model/types';

export const usePublicEvents = createSimpleRemoteQuery<PublicEventsResponse>({
  queryKey: ['events', 'public'],
  endpoint: '/api/events/public', // Muss /api/ haben!
  schema: publicEventsResponseSchema,
  staleTime: 1000 * 60 * 5,
});

export const useUpcomingEvents = createSimpleRemoteQuery<PublicEventsResponse>({
  queryKey: ['events', 'public', 'upcoming'],
  endpoint: '/api/events/public/upcoming', // Muss /api/ haben!
  schema: publicEventsResponseSchema,
  staleTime: 1000 * 60 * 5,
});

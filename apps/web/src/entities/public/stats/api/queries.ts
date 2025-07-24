// entities/public/stats/api/queries.ts
import { createSimpleRemoteQuery } from '@/shared/api';
import { API_ROUTES } from '@/shared/api/constants';

import { statsResponseSchema } from '../model/schemas';

import type { StatsResponse } from '../model/types';

export const usePublicStats = createSimpleRemoteQuery<StatsResponse>({
  queryKey: ['stats', 'public'],
  endpoint: API_ROUTES.PUBLIC.STATS,
  schema: statsResponseSchema,
  staleTime: 1000 * 60 * 30,
  refetchOnWindowFocus: false,
});

// frontend/src/entities/public/stats/api/queries.ts
import { createSimpleRemoteQuery } from '@/shared/api';

import { statsResponseSchema } from '../model/schemas';

import type { StatsResponse } from '../model/types';

// frontend/src/entities/public/stats/api/queries.ts
export const usePublicStats = createSimpleRemoteQuery<StatsResponse>({
  queryKey: ['stats', 'public'],
  endpoint: '/api/stats/public', // Muss /api/ haben!
  schema: statsResponseSchema,
  staleTime: 1000 * 60 * 30,
  refetchOnWindowFocus: false,
});

// frontend/src/entities/team-history/api/queries.ts
import { createSimpleRemoteQuery } from '@/shared/api';

import { availableYearsResponseSchema, teamHistoryYearResponseSchema } from '../model/schemas';

import type { AvailableYearsResponse, TeamHistoryYearResponse } from '../model/types';

/**
 * Lädt alle verfügbaren Jahre und Team-Typen
 */
export const useAvailableYears = createSimpleRemoteQuery<AvailableYearsResponse>({
  queryKey: ['team-history', 'available-years'],
  endpoint: '/api/team-history/years',
  schema: availableYearsResponseSchema,
  staleTime: 1000 * 60 * 30, // 30 Minuten
});

/**
 * Lädt Team-History für ein spezifisches Jahr
 */
export const useTeamHistoryByYear = (year: number) =>
  createSimpleRemoteQuery<TeamHistoryYearResponse>({
    queryKey: ['team-history', 'year', year],
    endpoint: `/api/team-history/${String(year)}`,
    schema: teamHistoryYearResponseSchema,
    staleTime: 1000 * 60 * 15,
    enabled: year > 0,
  });

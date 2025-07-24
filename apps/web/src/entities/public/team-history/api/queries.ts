// entities/public/team-history/api/queries.ts
import { createSimpleRemoteQuery } from '@/shared/api';
import { API_ROUTES } from '@/shared/api/constants';

import { availableYearsResponseSchema, teamHistoryYearResponseSchema } from '../model/schemas';

import type { AvailableYearsResponse, TeamHistoryYearResponse } from '../model/types';

/**
 * Lädt alle verfügbaren Jahre und Team-Typen
 */
export const useAvailableYears = createSimpleRemoteQuery<AvailableYearsResponse>({
  queryKey: ['team-history', 'available-years'],
  endpoint: API_ROUTES.PUBLIC.TEAM_HISTORY.YEARS,
  schema: availableYearsResponseSchema,
  staleTime: 1000 * 60 * 30, // 30 Minuten
});

/**
 * Lädt Team-History für ein spezifisches Jahr
 */
export const useTeamHistoryByYear = (year: number) =>
  createSimpleRemoteQuery<TeamHistoryYearResponse>({
    queryKey: ['team-history', 'year', year],
    endpoint: API_ROUTES.PUBLIC.TEAM_HISTORY.BY_YEAR(year),
    schema: teamHistoryYearResponseSchema,
    staleTime: 1000 * 60 * 15,
    enabled: year > 0,
  });

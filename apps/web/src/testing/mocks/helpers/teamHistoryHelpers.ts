// frontend/src/testing/mocks/db/seeds/teamHistoryHelpers.ts
import type { AvailableYearsResponse } from '@/entities/public/team-history';

export const createAvailableYearsResponse = (): AvailableYearsResponse => ({
  id: 'available-years',
  years: [2022, 2023, 2024, 2025],
  teamTypes: {
    2022: ['lol', 'fanini'],
    2023: ['lol', 'fanini'],
    2024: ['lol', 'baller', 'fanini'],
    2025: ['lol', 'baller', 'fanini'],
  },
});

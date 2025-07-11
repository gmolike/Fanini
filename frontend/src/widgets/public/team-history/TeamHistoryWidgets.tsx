// frontend/src/widgets/public/team-history/ui/Widget.tsx
import { useState } from 'react';

import { TeamHistoryHero } from '@/features/public/team-history';

import { useAvailableYears, useTeamHistoryByYear } from '@/entities/public/team-history';

export const TeamHistoryWidget = () => {
  const { data: availableYears, isLoading: isLoadingYears } = useAvailableYears();
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear - 1);

  const teamHistoryQuery = useTeamHistoryByYear(selectedYear);
  const { data: yearData, isLoading: isLoadingData } = teamHistoryQuery();

  if (isLoadingYears || !availableYears) {
    return <TeamHistoryHero.Skeleton />;
  }

  return (
    <TeamHistoryHero
      selectedYear={selectedYear}
      availableYears={availableYears.years}
      yearData={yearData}
      isLoading={isLoadingData}
      onYearChange={setSelectedYear}
    />
  );
};

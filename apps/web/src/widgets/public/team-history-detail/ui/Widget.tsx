// frontend/src/widgets/public/team-history-detail/ui/Widget.tsx
import { useParams } from '@tanstack/react-router';
import { Loader2 } from 'lucide-react';

import { TeamHistoryDetailView } from '@/features/public/team-history-detail';

import { type TeamType, useTeamHistoryByYear } from '@/entities/public/team-history';

import { GlassCard, LoadingState } from '@/shared/ui';

export const TeamHistoryDetailWidget = () => {
  const { year, teamType } = useParams({ from: '/_public/historie/$year/$teamType' });
  const yearNumber = parseInt(year, 10);

  const teamHistoryQuery = useTeamHistoryByYear(yearNumber);
  const query = teamHistoryQuery();

  return (
    <LoadingState
      query={query}
      loadingFallback={
        <div className="flex min-h-screen items-center justify-center">
          <GlassCard className="p-8">
            <Loader2 className="h-8 w-8 animate-spin text-[var(--color-fanini-blue)]" />
          </GlassCard>
        </div>
      }
    >
      {response => {
        return (
          <TeamHistoryDetailView
            yearData={response}
            teamType={teamType as TeamType}
            year={yearNumber}
          />
        );
      }}
    </LoadingState>
  );
};

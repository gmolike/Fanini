// frontend/src/features/public/team-history-detail/ui/DetailView.tsx
import { Link } from '@tanstack/react-router';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

import type { TeamHistoryYearResponse, TeamType } from '@/entities/public/team-history';

import { Button } from '@/shared/shadcn';
import { GlassCard } from '@/shared/ui';

import { TeamDetailCard } from './ui/Card';
import { DetailHero } from './ui/Hero';
import { NavigationBar } from './ui/NavigationBar';

type DetailViewProps = {
  yearData: TeamHistoryYearResponse;
  teamType: TeamType;
  year: number;
};

export const DetailView = ({ yearData, teamType, year }: DetailViewProps) => {
  const team = yearData.teams.find(t => t.teamType === teamType);

  if (!team) {
    return (
      <div className="container mx-auto px-4 py-12">
        <GlassCard className="p-8 text-center">
          <p className="text-[var(--color-muted-foreground)]">Team nicht gefunden</p>
        </GlassCard>
      </div>
    );
  }

  return (
    <>
      {/* Sticky Navigation */}
      <NavigationBar yearData={yearData} currentTeamType={teamType} year={year} />

      {/* Hero Section - yearData wird jetzt übergeben */}
      <DetailHero team={team} year={year} yearData={yearData} />

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-4xl">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-8"
          >
            <Button variant="ghost" size="sm" asChild>
              <Link to="/historie">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Zurück zur Übersicht
              </Link>
            </Button>
          </motion.div>

          {/* Team Detail Content mit AnimatePresence */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`team-${teamType}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{
                duration: 0.4,
                delay: 0.1, // Kleine Verzögerung für flüssigere Animation
              }}
            >
              <TeamDetailCard team={team} year={year} />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </>
  );
};

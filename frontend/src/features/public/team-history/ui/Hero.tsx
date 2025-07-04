// frontend/src/features/public/team-history/ui/Hero.tsx
import { AnimatePresence, motion } from 'framer-motion';
import { Calendar, ChevronDown } from 'lucide-react';

import { TeamHistoryContent } from '@/features/public/team-history';

import type { TeamHistoryYearResponse } from '@/entities/public/team-history';

import { AnimatedNumber, ModernTimeline } from '@/shared/ui';

type TeamHistoryHeroProps = {
  selectedYear: number;
  availableYears: number[];
  yearData?: TeamHistoryYearResponse;
  isLoading: boolean;
  onYearChange: (year: number) => void;
};

export const TeamHistoryHero = ({
  selectedYear,
  availableYears,
  yearData,
  isLoading,
  onYearChange,
}: TeamHistoryHeroProps) => {
  const renderContent = () => {
    if (isLoading) {
      return (
        <motion.div
          key="loading"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="flex justify-center py-20"
        >
          <div className="relative">
            <div className="h-16 w-16 animate-spin rounded-full border-4 border-[var(--color-fanini-blue)]/20 border-t-[var(--color-fanini-blue)]" />
            <Calendar className="absolute inset-0 m-auto h-8 w-8 text-[var(--color-fanini-blue)]" />
          </div>
        </motion.div>
      );
    }

    if (yearData) {
      return (
        <motion.div
          key={selectedYear}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3 }}
        >
          <TeamHistoryContent data={yearData} />
        </motion.div>
      );
    }

    return null;
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[var(--color-fanini-blue)]/10 via-transparent to-[var(--color-fanini-red)]/10">
      {/* Background Animation */}
      <div className="absolute inset-0">
        <div className="absolute -top-40 -right-40 h-80 w-80 animate-pulse rounded-full bg-[var(--color-fanini-blue)]/20 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 animate-pulse rounded-full bg-[var(--color-fanini-red)]/20 blur-3xl delay-1000" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-12">
        {/* Year Display */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <h1 className="bg-gradient-to-r from-[var(--color-fanini-blue)] to-[var(--color-fanini-red)] bg-clip-text font-[Bebas_Neue] text-8xl font-bold text-transparent md:text-9xl">
            <AnimatedNumber value={selectedYear} />
          </h1>
          <p className="mt-2 text-xl text-[var(--color-muted-foreground)]">
            Ein Jahr voller Momente
          </p>
        </motion.div>

        {/* Timeline */}
        <ModernTimeline
          years={availableYears}
          selectedYear={selectedYear}
          onYearChange={onYearChange}
        />

        {/* Content Area */}
        <AnimatePresence mode="wait">{renderContent()}</AnimatePresence>

        {/* Scroll Indicator */}
        {yearData ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 transform"
          >
            <ChevronDown className="h-8 w-8 animate-bounce text-[var(--color-muted-foreground)]" />
          </motion.div>
        ) : null}
      </div>
    </div>
  );
};

TeamHistoryHero.Skeleton = () => (
  <div className="min-h-screen animate-pulse bg-gradient-to-br from-[var(--color-fanini-blue)]/10 via-transparent to-[var(--color-fanini-red)]/10" />
);

// frontend/src/shared/ui/timeline/ModernTimeline.tsx (Alternative)
import { motion } from 'framer-motion';

import { cn } from '@/shared/lib';

type ModernTimelineProps = {
  years: number[];
  selectedYear: number;
  onYearChange: (year: number) => void;
};

/**
 * Moderne Timeline-Komponente zur Jahresauswahl mit responsivem Grid
 * @component
 * @param {number[]} years - Array der verfügbaren Jahre
 * @param {number} selectedYear - Aktuell ausgewähltes Jahr
 * @param {(year: number) => void} onYearChange - Callback bei Jahresänderung
 */
export const ModernTimeline = ({ years, selectedYear, onYearChange }: ModernTimelineProps) => {
  return (
    <div className="w-full px-4 py-8">
      {/* Responsive Grid für viele Jahre */}
      <div className="grid grid-cols-4 gap-4 sm:grid-cols-6 md:grid-cols-8 lg:flex lg:justify-center lg:gap-6">
        {years.map((year, index) => {
          const isSelected = year === selectedYear;

          return (
            <motion.button
              key={year}
              onClick={() => {
                onYearChange(year);
              }}
              className={cn(
                'bg-background relative flex h-14 w-14 items-center justify-center rounded-full border-2 transition-all duration-300 lg:h-16 lg:w-16',
                isSelected
                  ? 'scale-110 border-[var(--color-fanini-blue)] bg-gradient-to-r from-[var(--color-fanini-blue)] to-[var(--color-fanini-red)] text-white shadow-xl'
                  : 'border-[var(--color-muted-foreground)]/30 hover:scale-105 hover:border-[var(--color-fanini-blue)]'
              )}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.05 }}
              whileHover={!isSelected ? { scale: 1.05 } : {}}
              whileTap={{ scale: 0.95 }}
            >
              <span
                className={cn('text-sm font-bold lg:text-base', isSelected ? 'text-white' : '')}
              >
                {year}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

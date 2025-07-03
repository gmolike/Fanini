// frontend/src/shared/ui/timeline/ModernTimeline.tsx
import { motion } from 'framer-motion';

import { cn } from '@/shared/lib';

type ModernTimelineProps = {
  years: number[];
  selectedYear: number;
  onYearChange: (year: number) => void;
};

/**
 * Modern timeline component with animations
 * @description Zeigt Jahre in einer animierten Timeline
 */
export const ModernTimeline = ({ years, selectedYear, onYearChange }: ModernTimelineProps) => {
  return (
    <div className="relative mb-16">
      <div className="absolute inset-0 flex items-center">
        <div className="h-1 w-full bg-gradient-to-r from-transparent via-[var(--color-fanini-blue)]/20 to-transparent" />
      </div>
      <div className="relative flex justify-center gap-4 overflow-x-auto pb-4">
        {years.map((year, index) => (
          <motion.button
            key={year}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => { onYearChange(year); }}
            className={cn(
              'relative flex h-20 w-20 items-center justify-center rounded-full',
              'font-bold transition-all duration-300',
              year === selectedYear
                ? 'scale-125 bg-gradient-to-r from-[var(--color-fanini-blue)] to-[var(--color-fanini-red)] text-white shadow-lg'
                : 'bg-white shadow-md hover:bg-[var(--color-accent)] dark:bg-[var(--color-card)]'
            )}
          >
            {year}
            {year === selectedYear && (
              <motion.div
                layoutId="yearIndicator"
                className="absolute -bottom-8 h-0 w-0 border-t-[10px] border-r-[10px] border-l-[10px] border-t-[var(--color-fanini-blue)] border-r-transparent border-l-transparent"
              />
            )}
          </motion.button>
        ))}
      </div>
    </div>
  );
};

// frontend/src/features/public/team-history-detail/ui/sections/OtherDetailSection.tsx
import { motion } from 'framer-motion';
import { MoreHorizontal } from 'lucide-react';

import type { OtherContent, TeamHistoryEntry } from '@/entities/public/team-history';

import { GlassCard, ParallaxCard } from '@/shared/ui';

type OtherDetailSectionProps = {
  team: TeamHistoryEntry;
  year: number;
};

export const OtherDetailSection = ({ team, year }: OtherDetailSectionProps) => {
  const content = team.content as OtherContent;

  return (
    <div className="space-y-8">
      <ParallaxCard>
        <GlassCard className="p-8">
          <h2 className="mb-6 flex items-center gap-3 text-2xl font-bold">
            <MoreHorizontal className="h-6 w-6 text-[var(--color-muted-foreground)]" />
            {content.name} {year}
          </h2>

          {content.category ? (
            <p className="mb-4 text-lg text-[var(--color-muted-foreground)]">
              Kategorie: {content.category}
            </p>
          ) : null}

          <p className="text-lg leading-relaxed">{content.description}</p>
        </GlassCard>
      </ParallaxCard>

      {/* Custom Fields */}
      {Object.entries(content.customFields).length > 0 && (
        <GlassCard className="p-8">
          <h3 className="mb-6 text-xl font-bold">Details</h3>
          <div className="grid gap-4 md:grid-cols-2">
            {Object.entries(content.customFields).map(([key, value]) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="rounded-lg bg-[var(--color-muted)] p-4"
              >
                <p className="mb-1 text-sm font-medium text-[var(--color-muted-foreground)] capitalize">
                  {key.replace(/_/g, ' ')}
                </p>
                <p className="font-medium">
                  {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                </p>
              </motion.div>
            ))}
          </div>
        </GlassCard>
      )}
    </div>
  );
};

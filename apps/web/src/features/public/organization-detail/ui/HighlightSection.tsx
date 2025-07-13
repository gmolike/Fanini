// features/public/organization-detail/ui/HighlightSection.tsx
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

import { Badge } from '@/shared/shadcn';
import { GlassCard, HoverCard } from '@/shared/ui';

type HighlightSectionProps = {
  highlights: {
    title: string;
    description: string;
    date?: string;
  }[];
};

export const HighlightSection = ({ highlights }: HighlightSectionProps) => {
  return (
    <GlassCard className="p-8">
      <h2 className="mb-6 flex items-center gap-3 text-2xl font-bold">
        <Sparkles className="h-6 w-6 text-yellow-500" />
        Highlights
      </h2>

      <div className="grid gap-4">
        {highlights.map((highlight, index) => (
          <motion.div
            key={highlight.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <HoverCard>
              <div className="rounded-xl bg-gradient-to-r from-white/5 to-white/10 p-6 backdrop-blur-sm">
                <div className="mb-2 flex items-start justify-between">
                  <h3 className="text-lg font-semibold">{highlight.title}</h3>
                  {highlight.date ? <Badge variant="outline">{highlight.date}</Badge> : null}
                </div>
                <p className="text-[var(--color-muted-foreground)]">{highlight.description}</p>
              </div>
            </HoverCard>
          </motion.div>
        ))}
      </div>
    </GlassCard>
  );
};

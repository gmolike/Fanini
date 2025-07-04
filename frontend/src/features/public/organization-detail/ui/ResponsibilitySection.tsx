// features/public/organization-detail/ui/ResponsibilitySection.tsx
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';

import { GlassCard } from '@/shared/ui';

type ResponsibilitySectionProps = {
  responsibilities: string[];
};

export const ResponsibilitySection = ({ responsibilities }: ResponsibilitySectionProps) => {
  return (
    <GlassCard className="mb-8 p-8">
      <h2 className="mb-6 text-2xl font-bold">Verantwortlichkeiten</h2>

      <div className="grid gap-3 md:grid-cols-2">
        {responsibilities.map((resp, index) => (
          <motion.div
            key={resp}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex items-start gap-3"
          >
            <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-500" />
            <span className="text-[var(--color-muted-foreground)]">{resp}</span>
          </motion.div>
        ))}
      </div>
    </GlassCard>
  );
};

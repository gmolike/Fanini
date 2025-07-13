/* eslint-disable @typescript-eslint/naming-convention */
// features/public/event-detail/ui/History.tsx
import { motion } from 'framer-motion';
import { CheckCircle, Info, Megaphone, Ticket } from 'lucide-react';

import { GlassCard } from '@/shared/ui';

type EventHistoryProps = {
  history: {
    date: string;
    action: 'created' | 'updated' | 'announced' | 'registration_opened' | 'sold_out';
    description: string;
  }[];
};

const ACTION_CONFIG = {
  created: { icon: Info, color: 'text-blue-500' },
  updated: { icon: Info, color: 'text-yellow-500' },
  announced: { icon: Megaphone, color: 'text-purple-500' },
  registration_opened: { icon: Ticket, color: 'text-green-500' },
  sold_out: { icon: CheckCircle, color: 'text-red-500' },
};

export const EventHistory = ({ history }: EventHistoryProps) => {
  return (
    <GlassCard className="p-8">
      <h2 className="mb-6 text-2xl font-bold">Event-Verlauf</h2>

      <div className="relative">
        {/* Timeline Line */}
        <div className="absolute top-0 left-4 h-full w-0.5 bg-gradient-to-b from-[var(--color-fanini-blue)] to-transparent" />

        {/* Timeline Items */}
        <div className="space-y-6">
          {history.map((item, index) => {
            const config = ACTION_CONFIG[item.action];
            const Icon = config.icon;

            return (
              <motion.div
                key={`${item.date}-${String(index)}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative flex gap-4"
              >
                {/* Icon */}
                <div
                  className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md ${config.color}`}
                >
                  <Icon className="h-4 w-4" />
                </div>

                {/* Content */}
                <div className="flex-1 pb-2">
                  <p className="text-sm text-[var(--color-muted-foreground)]">
                    {new Date(item.date).toLocaleDateString('de-DE')}
                  </p>
                  <p className="mt-1">{item.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </GlassCard>
  );
};

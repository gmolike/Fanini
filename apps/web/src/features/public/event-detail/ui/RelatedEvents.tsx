// features/public/event-detail/ui/RelatedEvents.tsx
import { Link } from '@tanstack/react-router';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar } from 'lucide-react';

import { GlassCard } from '@/shared/ui';

type RelatedEventsProps = {
  events: {
    id: string;
    title: string;
    date: string;
  }[];
};

export const RelatedEvents = ({ events }: RelatedEventsProps) => {
  return (
    <GlassCard className="p-6">
      <h3 className="mb-4 text-lg font-semibold">Ähnliche Events</h3>

      <div className="space-y-3">
        {events.map((event, index) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link
              to="/events/$eventId"
              params={{ eventId: event.id }}
              className="block rounded-lg border p-3 transition-all hover:shadow-md"
            >
              <h4 className="mb-1 font-medium">{event.title}</h4>
              <div className="flex items-center gap-2 text-sm text-[var(--color-muted-foreground)]">
                <Calendar className="h-3.5 w-3.5" />
                {new Date(event.date).toLocaleDateString('de-DE')}
                <ArrowRight className="ml-auto h-4 w-4" />
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </GlassCard>
  );
};

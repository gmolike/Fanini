// frontend/src/features/public/event-calendar/ui/CalendarDay.tsx
import { motion } from 'framer-motion';

import { EVENT_ORGANIZER_CONFIG, type PublicEventListItem } from '@/entities/public/event';

import { cn } from '@/shared/lib';
import { HoverCard } from '@/shared/ui';

type CalendarDayProps = {
  day: Date;
  events: PublicEventListItem[];
  isCurrentMonth: boolean;
  isToday: boolean;
  selectedEventId: string | null;
  onEventSelect: (eventId: string) => void;
  animationDelay: number;
};

export const CalendarDay = ({
  day,
  events,
  isCurrentMonth,
  isToday,
  selectedEventId,
  onEventSelect,
  animationDelay,
}: CalendarDayProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: animationDelay }}
      className={cn(
        'bg-background relative min-h-[120px] p-2 transition-colors',
        !isCurrentMonth && 'bg-muted/30 text-muted-foreground',
        isToday && 'ring-2 ring-[var(--color-fanini-blue)] ring-offset-2'
      )}
    >
      {/* Day Number */}
      <div className={cn('mb-1 text-sm font-medium', isToday && 'text-[var(--color-fanini-blue)]')}>
        {day.getDate()}
      </div>

      {/* Events */}
      <div className="space-y-1">
        {events.slice(0, 3).map(event => {
          const organizerConfig = EVENT_ORGANIZER_CONFIG[event.organizer];
          const isSelected = selectedEventId === event.id;

          return (
            <HoverCard key={event.id}>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  onEventSelect(event.id);
                }}
                className={cn(
                  'w-full rounded-md px-2 py-1 text-left text-xs transition-all',
                  'hover:shadow-sm',
                  isSelected
                    ? 'bg-[var(--color-fanini-blue)] text-white shadow-md'
                    : 'bg-muted/50 hover:bg-muted'
                )}
                style={{
                  borderLeft: `3px solid ${organizerConfig.color}`,
                }}
              >
                <span className="block truncate font-medium">{event.title}</span>
                <span className="block truncate text-[10px] opacity-75">{event.time}</span>
              </motion.button>
            </HoverCard>
          );
        })}

        {events.length > 3 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-muted-foreground text-center text-xs"
          >
            +{events.length - 3} weitere
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

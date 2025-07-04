// frontend/src/features/public/event-grid/ui/EventCard.tsx
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, Sparkles, Users } from 'lucide-react';

import {
  EVENT_CATEGORY_CONFIG,
  EVENT_ORGANIZER_CONFIG,
  type PublicEventListItem,
} from '@/entities/public/event';

import { Badge } from '@/shared/shadcn';
import { AnimatedNumber, FloatingCard, HoverCard, Image } from '@/shared/ui';

type EventCardProps = {
  event: PublicEventListItem;
  onSelect: () => void;
};

export const EventCard = ({ event, onSelect }: EventCardProps) => {
  const organizerConfig = EVENT_ORGANIZER_CONFIG[event.organizer];
  const categoryConfig = EVENT_CATEGORY_CONFIG[event.category];
  const participantPercentage = event.maxParticipants
    ? ((event.currentParticipants ?? 0) / event.maxParticipants) * 100
    : 0;

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 },
        exit: { opacity: 0, scale: 0.95 },
      }}
      whileHover={{ y: -5 }}
      onClick={onSelect}
    >
      <HoverCard>
        <FloatingCard className="group cursor-pointer overflow-hidden">
          {/* Gradient Border */}
          <div
            className="h-1.5 bg-gradient-to-r"
            style={{
              background: `linear-gradient(to right, ${organizerConfig.color}, ${organizerConfig.color}dd)`,
            }}
          />

          {/* Image Section */}
          <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
            {event.thumbnailImage ? (
              <>
                <Image
                  src={event.thumbnailImage}
                  alt={event.title}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              </>
            ) : (
              <div className="flex h-full items-center justify-center">
                <motion.div
                  animate={{
                    rotate: [0, 10, -10, 0],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    repeatType: 'reverse',
                  }}
                >
                  <Sparkles className="h-16 w-16 text-gray-300 dark:text-gray-600" />
                </motion.div>
              </div>
            )}

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              <Badge className={`${organizerConfig.badge} backdrop-blur-sm`}>
                {organizerConfig.name}
              </Badge>
              <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm dark:bg-black/90">
                <span className={categoryConfig.color}>{categoryConfig.icon}</span>
                <span className="ml-1">{categoryConfig.label}</span>
              </Badge>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-4 p-6">
            <div>
              <h3 className="from-foreground to-foreground/70 mb-2 line-clamp-2 bg-gradient-to-r bg-clip-text text-xl font-bold text-transparent">
                {event.title}
              </h3>
            </div>

            {/* Meta Info */}
            <div className="text-muted-foreground space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-[var(--color-fanini-blue)]" />
                <span>
                  {new Date(event.date).toLocaleDateString('de-DE', {
                    weekday: 'short',
                    day: 'numeric',
                    month: 'long',
                  })}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-[var(--color-fanini-blue)]" />
                <span>{event.time} Uhr</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-[var(--color-fanini-blue)]" />
                <span className="truncate">{event.location}</span>
              </div>
            </div>

            {/* Participants */}
            {event.maxParticipants ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>Teilnehmer</span>
                  </span>
                  <span className="font-semibold">
                    <AnimatedNumber value={event.currentParticipants ?? 0} /> /{' '}
                    {event.maxParticipants}
                  </span>
                </div>
                <div className="relative h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                  <motion.div
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-[var(--color-fanini-blue)] to-[var(--color-fanini-red)]"
                    initial={{ width: 0 }}
                    animate={{ width: `${String(participantPercentage)}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                  />
                </div>
              </div>
            ) : null}
          </div>
        </FloatingCard>
      </HoverCard>
    </motion.div>
  );
};

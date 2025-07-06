// features/public/event-list/ui/EventCard.tsx
import { motion } from 'framer-motion';
import { ArrowRight, Calendar, Clock, MapPin, Users } from 'lucide-react';

import {
  EVENT_CATEGORY_CONFIG,
  EVENT_ORGANIZER_CONFIG,
  EVENT_TYPE_CONFIG,
  type PublicEventListItem,
} from '@/entities/public/event';

import { Badge, Button } from '@/shared/shadcn';
import { AnimatedValue, FloatingCard, Image } from '@/shared/ui';

type EventCardProps = {
  event: PublicEventListItem;
  onSelect: (id: string) => void;
};

/**
 * Berechnet die verbleibende Zeit bis zum Event
 */
const getTimeUntilEvent = (eventDate: string, eventTime: string): string => {
  const dateParts = eventDate.split('-');
  const timeParts = eventTime.split(':');

  if (dateParts.length !== 3 || timeParts.length < 2) {
    return 'Ungültiges Datum';
  }

  const year = parseInt(dateParts[0] ?? '', 10);
  const month = parseInt(dateParts[1] ?? '', 10);
  const day = parseInt(dateParts[2] ?? '', 10);
  const eventHours = parseInt(timeParts[0] ?? '', 10);
  const eventMinutes = parseInt(timeParts[1] ?? '', 10);

  const eventDateTime = new Date(year, month - 1, day, eventHours, eventMinutes);
  const now = new Date();
  const diff = eventDateTime.getTime() - now.getTime();

  if (diff < 0) return 'Vergangen';

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

  if (days === 0 && hours === 0) {
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `In ${String(minutes)} Minuten`;
  }
  if (days === 0) return `Heute, ${String(hours)}h`;
  if (days === 1) return `Morgen`;
  if (days < 7) return `In ${String(days)} Tagen`;
  if (days < 30) return `In ${String(Math.floor(days / 7))} Wochen`;
  return `In $String({Math.floor(days / 30))} Monaten`;
};

export const EventCard = ({ event, onSelect }: EventCardProps) => {
  const typeConfig = EVENT_TYPE_CONFIG[event.type];
  const orgConfig = EVENT_ORGANIZER_CONFIG[event.organizer];
  const categoryConfig = EVENT_CATEGORY_CONFIG[event.category];
  const timeUntil = getTimeUntilEvent(event.date, event.time);

  const getTimeUntilBadgeClass = () => {
    if (timeUntil === 'Vergangen') return 'bg-gray-900/80 text-gray-300';
    if (timeUntil.includes('Heute')) return 'bg-red-600/90 text-white animate-pulse';
    return 'bg-[var(--color-fanini-blue)]/90 text-white';
  };

  const getParticipantProgressClass = () => {
    if (!event.maxParticipants || event.currentParticipants === undefined) return '';
    const ratio = event.currentParticipants / event.maxParticipants;
    if (ratio >= 1) return 'bg-red-500';
    if (ratio >= 0.8) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 },
      }}
    >
      <FloatingCard>
        <div className="group bg-card h-full overflow-hidden rounded-xl border transition-all hover:shadow-2xl">
          {/* Event Image */}
          {event.thumbnailImage ? (
            <div className="relative aspect-video overflow-hidden">
              <Image
                src={event.thumbnailImage}
                alt={event.title}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

              {/* Time Badge - Prominent Position */}
              <div className="absolute top-4 left-4">
                <Badge className={`backdrop-blur-md ${getTimeUntilBadgeClass()}`}>
                  <Clock className="mr-1 h-3.5 w-3.5" />
                  {timeUntil}
                </Badge>
              </div>

              {/* Category Badge */}
              <Badge
                className="absolute top-4 right-4 backdrop-blur-md"
                style={{ background: `${orgConfig.color}dd` }}
              >
                <span className="text-white">{orgConfig.name}</span>
              </Badge>

              {/* Event Type */}
              <Badge className={`absolute bottom-4 left-4 ${typeConfig.color}`}>
                {typeConfig.label}
              </Badge>
            </div>
          ) : (
            <div className="relative h-48 bg-gradient-to-br from-[var(--color-fanini-blue)]/20 to-[var(--color-fanini-red)]/20">
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-6xl opacity-30">{categoryConfig.icon}</span>
              </div>

              {/* Same badges for no-image variant */}
              <div className="absolute top-4 left-4">
                <Badge className={getTimeUntilBadgeClass()}>
                  <Clock className="mr-1 h-3.5 w-3.5" />
                  {timeUntil}
                </Badge>
              </div>
            </div>
          )}

          {/* Content */}
          <div className="space-y-4 p-6">
            {/* Date & Location */}
            <div className="flex flex-wrap gap-3 text-sm text-[var(--color-muted-foreground)]">
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                {new Date(event.date).toLocaleDateString('de-DE', {
                  weekday: 'short',
                  day: 'numeric',
                  month: 'short',
                })}
                , {event.time} Uhr
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" />
                {event.location}
              </span>
            </div>

            {/* Title */}
            <h3 className="line-clamp-2 bg-gradient-to-r from-[var(--color-fanini-blue)] to-[var(--color-fanini-red)] bg-clip-text text-xl font-bold text-transparent">
              {event.title}
            </h3>

            {/* Participation */}
            {typeof event.maxParticipants === 'number' &&
              typeof event.currentParticipants === 'number' && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1 text-[var(--color-muted-foreground)]">
                      <Users className="h-3.5 w-3.5" />
                      Teilnehmer
                    </span>
                    <span className="font-medium">
                      <AnimatedValue value={event.currentParticipants} /> / {event.maxParticipants}
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{
                        width: `${((event.currentParticipants / event.maxParticipants) * 100).toFixed(2)}%`,
                      }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className={getParticipantProgressClass()}
                    />
                  </div>
                </div>
              )}

            {/* Action */}
            <Button
              onClick={() => {
                onSelect(event.id);
              }}
              className="group/btn w-full"
              variant={timeUntil === 'Vergangen' ? 'outline' : 'default'}
            >
              Details ansehen
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
            </Button>
          </div>
        </div>
      </FloatingCard>
    </motion.div>
  );
};

// features/public/event-detail/ui/Hero.tsx
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, Users } from 'lucide-react';

import {
  EVENT_ORGANIZER_CONFIG,
  EVENT_TYPE_CONFIG,
  type PublicEventDetail,
} from '@/entities/public/event';

import { Badge } from '@/shared/shadcn';
import { AnimatedValue, Image } from '@/shared/ui';

type EventHeroProps = {
  event: PublicEventDetail;
};

export const EventHero = ({ event }: EventHeroProps) => {
  const typeConfig = EVENT_TYPE_CONFIG[event.type];
  const orgConfig = EVENT_ORGANIZER_CONFIG[event.organizer];
  const eventDate = new Date(`${event.date}T${event.time}`);
  const isPast = eventDate < new Date();

  return (
    <div className="relative min-h-[60vh] overflow-hidden">
      {/* Background Image */}
      {event.bannerImage ? (
        <motion.div
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0"
        >
          <Image src={event.bannerImage} alt={event.title} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        </motion.div>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-fanini-blue)] to-[var(--color-fanini-red)]" />
      )}

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4">
        <div className="flex min-h-[60vh] items-end pb-12">
          <div className="max-w-4xl space-y-6">
            {/* Badges */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-wrap gap-3"
            >
              <Badge
                className="px-4 py-2 text-lg"
                style={{ backgroundColor: `${orgConfig.color}dd` }}
              >
                <span className="text-white">{orgConfig.name}</span>
              </Badge>
              <Badge className={`px-4 py-2 text-lg ${typeConfig.color}`}>{typeConfig.label}</Badge>
              {isPast ? (
                <Badge variant="secondary" className="px-4 py-2 text-lg">
                  Vergangen
                </Badge>
              ) : null}
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-5xl font-bold text-white md:text-7xl"
            >
              {event.title}
            </motion.h1>

            {/* Meta Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap gap-6 text-white/90"
            >
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                <span className="text-lg">
                  {eventDate.toLocaleDateString('de-DE', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                <span className="text-lg">{event.time} Uhr</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                <span className="text-lg">{event.location}</span>
              </div>
              {event.maxParticipants ? (
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  <span className="text-lg">
                    <AnimatedValue value={event.currentParticipants ?? 0} /> /{' '}
                    {event.maxParticipants} Teilnehmer
                  </span>
                </div>
              ) : null}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

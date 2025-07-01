// frontend/src/features/public/event-grid/ui/Card.tsx
import { Calendar, MapPin, Users } from 'lucide-react';

import {
  EVENT_CATEGORY_CONFIG,
  EVENT_ORGANIZER_CONFIG,
  type PublicEventListItem,
} from '@/entities/public/event';

import { Badge, Card as ShadcnCard, CardContent } from '@/shared/shadcn';
import { Image } from '@/shared/ui';

type CardProps = {
  event: PublicEventListItem;
};

/**
 * Card Component
 * @description Einzelne Event-Karte für Grid-Ansicht
 */
export const Card = ({ event }: CardProps) => {
  const organizerConfig = EVENT_ORGANIZER_CONFIG[event.organizer];
  const categoryConfig = EVENT_CATEGORY_CONFIG[event.category];

  return (
    <ShadcnCard className="group overflow-hidden transition-all duration-300 hover:shadow-lg">
      {/* Organizer Color Bar */}
      <div className="h-1" style={{ backgroundColor: organizerConfig.color }} />

      {/* Event Image */}
      <div className="relative aspect-video overflow-hidden bg-gray-100">
        {event.thumbnailImage ? (
          <Image
            src={event.thumbnailImage}
            alt={event.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <Calendar className="h-16 w-16 text-gray-300" />
          </div>
        )}

        {/* Organizer Badge */}
        <Badge className={`absolute top-2 right-2 ${organizerConfig.badge}`}>
          {organizerConfig.name}
        </Badge>
      </div>

      <CardContent className="p-6">
        {/* Category & Type */}
        <div className="mb-3 flex items-center gap-2">
          <span className={`text-lg ${categoryConfig.color}`}>{categoryConfig.icon}</span>
          <Badge variant="outline">{categoryConfig.label}</Badge>
        </div>

        {/* Title */}
        <h3 className="mb-3 line-clamp-2 text-xl font-semibold transition-colors group-hover:text-[var(--color-fanini-blue)]">
          {event.title}
        </h3>

        {/* Meta Info */}
        <div className="text-muted-foreground space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>
              {new Date(event.date).toLocaleDateString('de-DE', {
                weekday: 'short',
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span className="truncate">{event.location}</span>
          </div>

          {event.maxParticipants ? (
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>
                {event.currentParticipants ?? 0} / {event.maxParticipants} Teilnehmer
              </span>
            </div>
          ) : null}
        </div>

        {/* Progress Bar für Teilnehmer */}
        {event.maxParticipants ? (
          <div className="mt-4">
            <div className="h-2 overflow-hidden rounded-full bg-gray-200">
              <div
                className="h-full bg-gradient-to-r from-[var(--color-fanini-blue)] to-[var(--color-fanini-red)] transition-all duration-500"
                style={{
                  width: `${String(((event.currentParticipants ?? 0) / event.maxParticipants) * 100)}%`,
                }}
              />
            </div>
          </div>
        ) : null}
      </CardContent>
    </ShadcnCard>
  );
};

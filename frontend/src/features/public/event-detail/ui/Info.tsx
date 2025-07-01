// frontend/src/features/public/event-detail/ui/Info.tsx
import { Calendar, Clock, MapPin, User } from 'lucide-react';

import type { PublicEventDetail } from '@/entities/public/event';

type InfoProps = {
  event: PublicEventDetail;
};

/**
 * Info Component
 * @description Zeigt Basis-Informationen des Events
 */
export const Info = ({ event }: InfoProps) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3 text-sm">
        <Calendar className="text-muted-foreground h-4 w-4" />
        <span>
          {new Date(event.date).toLocaleDateString('de-DE', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })}
        </span>
      </div>

      <div className="flex items-center gap-3 text-sm">
        <Clock className="text-muted-foreground h-4 w-4" />
        <span>{event.time} Uhr</span>
      </div>

      <div className="flex items-center gap-3 text-sm">
        <MapPin className="text-muted-foreground h-4 w-4" />
        <span>{event.location}</span>
      </div>

      {event.responsiblePerson ? (
        <div className="flex items-center gap-3 text-sm">
          <User className="text-muted-foreground h-4 w-4" />
          <span>
            {event.responsiblePerson.name}
            {event.responsiblePerson.role ? (
              <span className="text-muted-foreground"> ({event.responsiblePerson.role})</span>
            ) : null}
          </span>
        </div>
      ) : null}
    </div>
  );
};

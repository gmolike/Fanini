// frontend/src/features/team-history/SpecialEventsCard/SpecialEventsCard.tsx
import { Calendar, Milestone, PartyPopper, Trophy } from 'lucide-react';

import type { SpecialEventContent } from '@/entities/public/team-history';

import { Card, CardContent } from '@/shared/shadcn';

type SpecialEventsCardProps = {
  events: SpecialEventContent[];
};

const CATEGORY_ICONS = {
  championship: Trophy,
  celebration: PartyPopper,
  milestone: Milestone,
  other: Calendar,
};

/**
 * Zeigt besondere Ereignisse des Jahres
 * @component
 */
export const SpecialEventsCard = ({ events }: SpecialEventsCardProps) => {
  return (
    <div className="space-y-4">
      {events.map(event => {
        const Icon = CATEGORY_ICONS[event.category];
        return (
          <Card key={event.id ?? `${event.title}-${event.date}`}>
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-[var(--color-muted)] p-3">
                  <Icon className="h-5 w-5 text-[var(--color-fanini-blue)]" />
                </div>
                <div className="flex-1">
                  <div className="mb-2 flex items-start justify-between">
                    <h3 className="font-semibold">{event.title}</h3>
                    <span className="text-sm text-[var(--color-muted-foreground)]">
                      {event.date}
                    </span>
                  </div>
                  <p className="text-sm text-[var(--color-muted-foreground)]">
                    {event.description}
                  </p>
                  {event.images && event.images.length > 0 ? (
                    <div className="mt-3 flex gap-2">
                      {event.images.slice(0, 4).map(image => (
                        <div
                          key={image}
                          className="h-20 w-20 overflow-hidden rounded bg-[var(--color-muted)]"
                        >
                          <img src={image} alt="" className="h-full w-full object-cover" />
                        </div>
                      ))}
                    </div>
                  ) : null}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

// frontend/src/features/public/event-calendar/ui/Grid.tsx
import { EVENT_ORGANIZER_CONFIG, type PublicEventListItem } from '@/entities/public/event';

import { cn } from '@/shared/lib';

type CalendarGridProps = {
  events: PublicEventListItem[];
  currentMonth: number;
  currentYear: number;
  selectedEventId: string | null;
  onEventSelect: (eventId: string) => void;
};

/**
 * CalendarGrid Component
 * @description Kalender-Grid mit Event-Einträgen
 */
export const CalendarGrid = ({
  events,
  currentMonth,
  currentYear,
  selectedEventId,
  onEventSelect,
}: CalendarGridProps) => {
  // Kalender-Logik
  const firstDay = new Date(currentYear, currentMonth, 1);
  const lastDay = new Date(currentYear, currentMonth + 1, 0);
  const startDate = new Date(firstDay);
  startDate.setDate(startDate.getDate() - firstDay.getDay());

  const days = [];
  const currentDate = new Date(startDate);

  while (currentDate <= lastDay || currentDate.getDay() !== 0) {
    days.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  // Events nach Datum gruppieren
  const eventsByDate = events.reduce<Record<string, PublicEventListItem[]>>((acc, event) => {
    const dateKey = new Date(event.date).toDateString();
    acc[dateKey] ??= [];
    acc[dateKey].push(event);
    return acc;
  }, {});

  return (
    <div className="bg-muted grid grid-cols-7 gap-px overflow-hidden rounded-lg">
      {/* Wochentage Header */}
      {['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'].map(day => (
        <div key={day} className="bg-background p-2 text-center text-sm font-medium">
          {day}
        </div>
      ))}

      {/* Kalendertage */}
      {days.map((day) => {
        const isCurrentMonth = day.getMonth() === currentMonth;
        const isToday = day.toDateString() === new Date().toDateString();
        const dayEvents = eventsByDate[day.toDateString()] ?? [];

        return (
          <div
            key={day.toISOString()}
            className={cn(
              'bg-background min-h-[100px] border border-transparent p-2',
              !isCurrentMonth && 'text-muted-foreground',
              isToday && 'bg-accent/10 border-accent'
            )}
          >
            <div className="mb-1 text-sm font-medium">{day.getDate()}</div>

            {/* Events des Tages */}
            <div className="space-y-1">
              {dayEvents.slice(0, 3).map(event => {
                const organizerConfig = EVENT_ORGANIZER_CONFIG[event.organizer];
                return (
                  <button
                    key={event.id}
                    onClick={() => {
                      onEventSelect(event.id);
                    }}
                    className={cn(
                      'w-full truncate rounded px-1 py-0.5 text-left text-xs transition-colors',
                      selectedEventId === event.id
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-muted'
                    )}
                    style={{
                      borderLeft: `3px solid ${organizerConfig.color}`,
                    }}
                  >
                    {event.title}
                  </button>
                );
              })}

              {dayEvents.length > 3 && (
                <div className="text-muted-foreground text-center text-xs">
                  +{dayEvents.length - 3} weitere
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

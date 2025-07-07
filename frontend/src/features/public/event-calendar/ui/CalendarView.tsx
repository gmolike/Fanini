// features/public/event-calendar/ui/CalendarView.tsx
import { useState } from 'react';

import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { EVENT_TYPE_CONFIG, type PublicEventListItem } from '@/entities/public/event';

import { Badge, Button } from '@/shared/shadcn';
import { GlassCard } from '@/shared/ui';

type CalendarViewProps = {
  events: PublicEventListItem[];
  onEventClick: (event: PublicEventListItem) => void;
};

const WEEKDAYS = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];
const MONTHS = [
  'Januar',
  'Februar',
  'März',
  'April',
  'Mai',
  'Juni',
  'Juli',
  'August',
  'September',
  'Oktober',
  'November',
  'Dezember',
];

export const CalendarView = ({ events, onEventClick }: CalendarViewProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = (firstDay.getDay() + 6) % 7; // Monday = 0

  // Group events by date with proper typing
  const eventsByDate = events.reduce<Record<string, PublicEventListItem[]>>((acc, event) => {
    const dateKey = event.date;
    acc[dateKey] ??= [];
    acc[dateKey].push(event);
    return acc;
  }, {});

  const changeMonth = (increment: number) => {
    setCurrentDate(new Date(year, month + increment, 1));
  };

  const renderDay = (day: number) => {
    const date = new Date(year, month, day);
    const dateKey: string = date.toISOString().split('T')[0] ?? '';
    const dayEvents = eventsByDate[dateKey] ?? [];
    const isToday = date.toDateString() === new Date().toDateString();
    const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();

    return (
      <motion.div
        key={day}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: day * 0.01 }}
        className={`relative min-h-[100px] cursor-pointer rounded-lg border p-2 transition-all hover:scale-105 hover:shadow-lg ${isToday ? 'border-[var(--color-fanini-blue)] bg-[var(--color-fanini-blue)]/5' : ''} ${isSelected ? 'ring-2 ring-[var(--color-fanini-red)]' : ''} ${dayEvents.length > 0 ? 'bg-gradient-to-br from-[var(--color-fanini-blue)]/5 to-[var(--color-fanini-red)]/5' : ''} `}
        onClick={() => {
          setSelectedDate(date);
        }}
      >
        <div
          className={`mb-1 text-sm font-medium ${isToday ? 'text-[var(--color-fanini-blue)]' : ''} `}
        >
          {day}
        </div>

        {/* Event indicators */}
        <div className="space-y-1">
          {dayEvents.slice(0, 3).map((event: PublicEventListItem, idx: number) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + idx * 0.05 }}
              className="cursor-pointer truncate text-xs hover:text-[var(--color-fanini-blue)]"
              onClick={e => {
                e.stopPropagation();
                onEventClick(event);
              }}
            >
              <span
                className={`mr-1 inline-block h-2 w-2 rounded-full ${EVENT_TYPE_CONFIG[event.type].color}`}
              />
              {event.title}
            </motion.div>
          ))}
          {dayEvents.length > 3 && (
            <div className="text-xs text-[var(--color-muted-foreground)]">
              +{dayEvents.length - 3} weitere
            </div>
          )}
        </div>
      </motion.div>
    );
  };

  const selectedDateKey = selectedDate?.toISOString().split('T')[0];
  const selectedDateEvents =
    selectedDateKey && eventsByDate[selectedDateKey] ? eventsByDate[selectedDateKey] : [];

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Calendar Grid */}
      <div className="lg:col-span-2">
        <GlassCard className="p-6">
          {/* Header */}
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold">
              {MONTHS[month]} {year}
            </h2>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => {
                  changeMonth(-1);
                }}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setCurrentDate(new Date());
                }}
              >
                Heute
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => {
                  changeMonth(1);
                }}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Weekdays */}
          <div className="mb-2 grid grid-cols-7 gap-2">
            {WEEKDAYS.map(day => (
              <div
                key={day}
                className="text-center text-sm font-medium text-[var(--color-muted-foreground)]"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-2">
            {/* Empty cells for start of month */}
            {Array.from({ length: startingDayOfWeek }).map((_, i) => (
              <div key={`empty-${String(i)}`} />
            ))}

            {/* Days */}
            {Array.from({ length: daysInMonth }).map((_, i) => renderDay(i + 1))}
          </div>
        </GlassCard>
      </div>

      {/* Selected Date Events */}
      <div>
        <GlassCard className="sticky top-24 p-6">
          <h3 className="mb-4 text-lg font-semibold">
            {selectedDate
              ? `Events am ${selectedDate.toLocaleDateString('de-DE', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                })}`
              : 'Datum auswählen'}
          </h3>

          {(() => {
            if (selectedDateEvents.length > 0) {
              return (
                <div className="space-y-3">
                  {selectedDateEvents.map((event: PublicEventListItem) => (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="cursor-pointer rounded-lg border p-3 transition-all hover:shadow-md"
                      onClick={() => {
                        onEventClick(event);
                      }}
                    >
                      <div className="mb-1 flex items-start justify-between">
                        <h4 className="font-medium">{event.title}</h4>
                        <Badge variant="outline" className="text-xs">
                          {event.time}
                        </Badge>
                      </div>
                      <p className="text-sm text-[var(--color-muted-foreground)]">{event.location}</p>
                      <div className="mt-2">
                        <Badge className={EVENT_TYPE_CONFIG[event.type].color}>
                          {EVENT_TYPE_CONFIG[event.type].label}
                        </Badge>
                      </div>
                    </motion.div>
                  ))}
                </div>
              );
            } else if (selectedDate) {
              return (
                <p className="text-[var(--color-muted-foreground)]">Keine Events an diesem Tag</p>
              );
            } else {
              return (
                <p className="text-[var(--color-muted-foreground)]">Wähle ein Datum im Kalender aus</p>
              );
            }
          })()}
        </GlassCard>
      </div>
    </div>
  );
};

// frontend/src/features/public/event-calendar/ui/CalendarGrid.tsx

import { type PublicEventListItem } from '@/entities/public/event';

import { CalendarDay } from './Day';

type CalendarGridProps = {
  events: PublicEventListItem[];
  currentMonth: number;
  currentYear: number;
  selectedEventId: string | null;
  onEventSelect: (eventId: string) => void;
};

export const CalendarGrid = ({
  events,
  currentMonth,
  currentYear,
  selectedEventId,
  onEventSelect,
}: CalendarGridProps) => {
  // Calendar logic
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

  // Group events by date
  const eventsByDate = events.reduce<Record<string, PublicEventListItem[]>>((acc, event) => {
    const dateKey = new Date(event.date).toDateString();
    acc[dateKey] ??= [];
    acc[dateKey].push(event);
    return acc;
  }, {});

  return (
    <div className="bg-border grid grid-cols-7 gap-px overflow-hidden rounded-xl">
      {/* Weekday headers */}
      {['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'].map(day => (
        <div key={day} className="bg-muted/50 p-3 text-center text-sm font-medium backdrop-blur-sm">
          {day}
        </div>
      ))}

      {/* Calendar days */}
      {days.map((day, index) => {
        const isCurrentMonth = day.getMonth() === currentMonth;
        const isToday = day.toDateString() === new Date().toDateString();
        const dayEvents = eventsByDate[day.toDateString()] ?? [];

        return (
          <CalendarDay
            key={day.toISOString()}
            day={day}
            events={dayEvents}
            isCurrentMonth={isCurrentMonth}
            isToday={isToday}
            selectedEventId={selectedEventId}
            onEventSelect={onEventSelect}
            animationDelay={index * 0.01}
          />
        );
      })}
    </div>
  );
};

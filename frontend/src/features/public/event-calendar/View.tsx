// frontend/src/features/public/event-calendar/ui/EventsCalendarView.tsx
import { useState } from 'react';

import { Calendar } from 'lucide-react';

import { EventDetailPanel } from '@/features/public/event-detail';

import { usePublicEventList } from '@/entities/public/event';

import { Card, ScrollArea } from '@/shared/shadcn';
import { LoadingState } from '@/shared/ui';

import { CalendarGrid } from './CalendarGrid';
import { CalendarHeader } from './CalendarHeader';

/**
 * EventsCalendarView Feature
 * @description Kalender-Ansicht mit Split-View für Event-Details
 */
export const EventsCalendarView = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  const eventsQuery = usePublicEventList();

  const currentMonth = selectedDate.getMonth();
  const currentYear = selectedDate.getFullYear();

  const navigateMonth = (direction: 'prev' | 'next') => {
    setSelectedDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + (direction === 'next' ? 1 : -1));
      return newDate;
    });
  };

  const goToToday = () => {
    setSelectedDate(new Date());
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      {/* Calendar Section */}
      <div className="lg:col-span-2">
        <Card>
          <div className="p-6">
            <CalendarHeader
              selectedDate={selectedDate}
              onNavigateMonth={navigateMonth}
              onGoToToday={goToToday}
            />

            {/* Calendar Grid */}
            <LoadingState query={eventsQuery}>
              {response => (
                <CalendarGrid
                  events={response.data}
                  currentMonth={currentMonth}
                  currentYear={currentYear}
                  selectedEventId={selectedEventId}
                  onEventSelect={setSelectedEventId}
                />
              )}
            </LoadingState>
          </div>
        </Card>
      </div>

      {/* Detail Panel */}
      <div className="lg:col-span-1">
        <Card className="sticky top-4">
          <ScrollArea className="h-[calc(100vh-8rem)]">
            {selectedEventId ? (
              <EventDetailPanel eventId={selectedEventId} />
            ) : (
              <div className="text-muted-foreground p-6 text-center">
                <Calendar className="mx-auto mb-4 h-12 w-12 text-gray-300" />
                <p>Wähle ein Event aus dem Kalender aus, um Details zu sehen.</p>
              </div>
            )}
          </ScrollArea>
        </Card>
      </div>
    </div>
  );
};

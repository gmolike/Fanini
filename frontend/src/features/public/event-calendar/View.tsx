// frontend/src/features/public/event-calendar/ui/CalendarView.tsx
import { useState } from 'react';

import { AnimatePresence, motion } from 'framer-motion';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

import { usePublicEventList } from '@/entities/public/event';

import { Button } from '@/shared/shadcn';
import { AnimatedValue, GlassCard, LoadingState } from '@/shared/ui';

import { EventDetailPanel } from './ui/DetailPanel';
import { CalendarGrid } from './ui/Grid';

export const View = () => {
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

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Calendar */}
      <div className="lg:col-span-2">
        <GlassCard className="p-6">
          {/* Header */}
          <div className="mb-6 flex items-center justify-between">
            <AnimatedValue className="text-2xl font-bold">
              {selectedDate.toLocaleDateString('de-DE', {
                month: 'long',
                year: 'numeric',
              })}
            </AnimatedValue>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  navigateMonth('prev');
                }}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelectedDate(new Date());
                }}
              >
                Heute
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  navigateMonth('next');
                }}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

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
        </GlassCard>
      </div>

      {/* Detail Panel */}
      <div className="lg:col-span-1">
        <AnimatePresence mode="wait">
          {selectedEventId ? (
            <EventDetailPanel
              key={selectedEventId}
              eventId={selectedEventId}
              onClose={() => {
                setSelectedEventId(null);
              }}
            />
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <GlassCard className="p-8 text-center">
                <Calendar className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
                <AnimatedValue className="mb-2 text-lg font-semibold">
                  Wähle ein Event aus
                </AnimatedValue>
                <p className="text-muted-foreground">
                  Klicke auf ein Event im Kalender, um Details zu sehen.
                </p>
              </GlassCard>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

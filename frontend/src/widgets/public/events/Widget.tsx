// widgets/public/events/ui/Widget.tsx
import { useNavigate } from '@tanstack/react-router';
import { motion } from 'framer-motion';
import { CalendarDays, List, Sparkles } from 'lucide-react';

import { EventCalendarView } from '@/features/public/event-calendar';
import { EventListView } from '@/features/public/event-list';

import { usePublicEventList } from '@/entities/public/event';

import { AnimatedValue, LoadingState, ModernTabs } from '@/shared/ui';
import type { ModernTabItem } from '@/shared/ui/modernTabs';

export const EventWidget = () => {
  const navigate = useNavigate();
  const eventsQuery = usePublicEventList();

  const handleEventSelect = (eventId: string) => {
    void navigate({ to: `/events/$eventId`, params: { eventId } });
  };

  const tabs: ModernTabItem[] = [
    {
      value: 'list',
      label: 'Listenansicht',
      shortLabel: 'Liste',
      icon: List,
      content: <EventListView />,
    },
    {
      value: 'calendar',
      label: 'Kalenderansicht',
      shortLabel: 'Kalender',
      icon: CalendarDays,
      content: (
        <LoadingState query={eventsQuery}>
          {response => (
            <EventCalendarView
              events={response.data}
              onEventClick={event => {
                handleEventSelect(event.id);
              }}
            />
          )}
        </LoadingState>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--color-fanini-blue)]/5 via-transparent to-[var(--color-fanini-red)]/5">
      {/* Hero Section - Event Special */}
      <div className="relative overflow-hidden py-24">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute -top-40 -right-40 h-96 w-96 animate-pulse rounded-full bg-[var(--color-fanini-blue)]/20 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 h-96 w-96 animate-pulse rounded-full bg-[var(--color-fanini-red)]/20 blur-3xl delay-1000" />
          <div className="absolute top-1/2 left-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 animate-pulse rounded-full bg-gradient-to-r from-[var(--color-fanini-blue)] to-[var(--color-fanini-red)] opacity-10 blur-3xl" />
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 text-center">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', duration: 0.8 }}
            className="mb-6 inline-flex rounded-full bg-gradient-to-r from-[var(--color-fanini-blue)] to-[var(--color-fanini-red)] p-5 shadow-2xl"
          >
            <Sparkles className="h-16 w-16 text-white" />
          </motion.div>

          <AnimatedValue delay={0.2}>
            <h1 className="mb-6 bg-gradient-to-r from-[var(--color-fanini-blue)] via-purple-600 to-[var(--color-fanini-red)] bg-clip-text pb-6 text-6xl font-bold text-transparent md:text-8xl">
              Events & Highlights
            </h1>
          </AnimatedValue>

          <AnimatedValue delay={0.3}>
            <p className="mx-auto max-w-3xl text-2xl text-[var(--color-muted-foreground)]">
              Erlebe die Leidenschaft! Von Auswärtsfahrten über Partys bis zu offiziellen Treffen -
              hier findest du alle Events der Faninitiative Spandau.
            </p>
          </AnimatedValue>

          {/* Quick Stats */}
          <LoadingState query={eventsQuery}>
            {response => {
              const upcomingCount = response.data.filter(
                e => new Date(`${e.date}T${e.time}`) > new Date()
              ).length;

              return (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="mt-8 flex justify-center gap-8"
                >
                  <div className="rounded-xl bg-white/10 px-6 py-3 backdrop-blur-sm">
                    <AnimatedValue
                      value={upcomingCount}
                      className="text-3xl font-bold text-white"
                    />
                    <p className="text-sm text-white/80">Anstehende Events</p>
                  </div>
                  <div className="rounded-xl bg-white/10 px-6 py-3 backdrop-blur-sm">
                    <AnimatedValue
                      value={response.data.length}
                      className="text-3xl font-bold text-white"
                    />
                    <p className="text-sm text-white/80">Events gesamt</p>
                  </div>
                </motion.div>
              );
            }}
          </LoadingState>
        </div>
      </div>

      {/* Content Section with Tabs */}
      <div className="container mx-auto px-4 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <ModernTabs items={tabs} defaultValue="list" />
        </motion.div>
      </div>
    </div>
  );
};

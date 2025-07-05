// frontend/src/features/public/event-grid/ui/GridView.tsx
import { useState } from 'react';

import { AnimatePresence, motion } from 'framer-motion';
import { Calendar, Search } from 'lucide-react';

import { usePublicEventList } from '@/entities/public/event';

import { Input } from '@/shared/shadcn';
import { AnimatedValue, GlassCard, LoadingState } from '@/shared/ui';

import { EventCard } from './ui/Card';
import { EventDetailModal } from './ui/DetailModel';
import { FilterPanel } from './ui/Filters';

export const GridView = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    category: 'all',
    organizer: 'all',
    timeRange: 'all',
  });

  const eventsQuery = usePublicEventList();

  const filteredEvents =
    eventsQuery.data?.data.filter(event => {
      const matchesSearch =
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = filters.category === 'all' || event.category === filters.category;
      const matchesOrganizer = filters.organizer === 'all' || event.organizer === filters.organizer;
      return matchesSearch && matchesCategory && matchesOrganizer;
    }) ?? [];

  return (
    <>
      <div className="space-y-8">
        {/* Search & Filter Header */}
        <GlassCard className="p-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="relative">
              <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
              <Input
                placeholder="Events durchsuchen..."
                value={searchTerm}
                onChange={e => {
                  setSearchTerm(e.target.value);
                }}
                className="bg-background/50 pl-10"
              />
            </div>
            <FilterPanel filters={filters} onFiltersChange={setFilters} />
          </div>
        </GlassCard>

        {/* Events Grid */}
        <LoadingState query={eventsQuery}>
          {() => (
            <AnimatePresence mode="wait">
              {filteredEvents.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <GlassCard className="p-12 text-center">
                    <Calendar className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
                    <AnimatedValue className="mb-2 text-xl font-semibold">
                      Keine Events gefunden
                    </AnimatedValue>
                    <p className="text-muted-foreground">
                      Versuche andere Filtereinstellungen oder schaue später nochmal vorbei.
                    </p>
                  </GlassCard>
                </motion.div>
              ) : (
                <motion.div
                  initial="hidden"
                  animate="show"
                  exit="exit"
                  variants={{
                    hidden: { opacity: 0 },
                    show: {
                      opacity: 1,
                      transition: { staggerChildren: 0.1 },
                    },
                    exit: { opacity: 0 },
                  }}
                  className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
                >
                  {filteredEvents.map(event => (
                    <EventCard
                      key={event.id}
                      event={event}
                      onSelect={() => {
                        setSelectedEventId(event.id);
                      }}
                    />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </LoadingState>
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedEventId ? (
          <EventDetailModal
            eventId={selectedEventId}
            onClose={() => {
              setSelectedEventId(null);
            }}
          />
        ) : null}
      </AnimatePresence>
    </>
  );
};

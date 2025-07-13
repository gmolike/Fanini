// features/public/event-list/ui/ListView.tsx
import { useState } from 'react';

import { useNavigate } from '@tanstack/react-router';
import { motion } from 'framer-motion';

import { usePublicEventList } from '@/entities/public/event';

import { GlassCard, LoadingState } from '@/shared/ui';

import { EventCard } from './EventCard';
import { EventFilterBar } from './FilterBar';

export const ListView = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedOrganizer, setSelectedOrganizer] = useState<string | null>(null);
  const [showPastEvents, setShowPastEvents] = useState(false);

  const eventsQuery = usePublicEventList();

  const handleSelect = (id: string) => {
    void navigate({ to: `/events/$eventId`, params: { eventId: id } });
  };

  return (
    <LoadingState query={eventsQuery}>
      {response => {
        const events = response.data;
        const now = new Date();

        const filtered = events.filter(event => {
          // Filter past events
          if (!event.date || !event.time) return false;
          const eventDate = new Date(`${event.date}T${event.time}`);
          const isPast = eventDate < now;
          if (!showPastEvents && isPast) return false;
          if (showPastEvents && !isPast) return false;

          // Search filter
          const matchesSearch =
            event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            event.location.toLowerCase().includes(searchTerm.toLowerCase());

          // Type filter
          const matchesType = !selectedType || event.type === selectedType;

          // Organizer filter
          const matchesOrganizer = !selectedOrganizer || event.organizer === selectedOrganizer;

          return matchesSearch && matchesType && matchesOrganizer;
        });

        // Sort by date - upcoming first
        filtered.sort((a, b) => {
          const dateAStr = a.date && a.time ? `${a.date}T${a.time}` : '';
          const dateBStr = b.date && b.time ? `${b.date}T${b.time}` : '';
          const dateA = dateAStr ? new Date(dateAStr) : new Date(0);
          const dateB = dateBStr ? new Date(dateBStr) : new Date(0);
          return showPastEvents
            ? dateB.getTime() - dateA.getTime()
            : dateA.getTime() - dateB.getTime();
        });

        return (
          <>
            <EventFilterBar
              searchTerm={searchTerm}
              selectedType={selectedType}
              selectedOrganizer={selectedOrganizer}
              showPastEvents={showPastEvents}
              onSearchChange={setSearchTerm}
              onTypeChange={setSelectedType}
              onOrganizerChange={setSelectedOrganizer}
              onPastEventsToggle={setShowPastEvents}
              eventCount={filtered.length}
            />

            {filtered.length === 0 ? (
              <GlassCard className="p-12 text-center">
                <p className="text-[var(--color-muted-foreground)]">
                  {showPastEvents
                    ? 'Keine vergangenen Events gefunden.'
                    : 'Keine anstehenden Events gefunden.'}
                </p>
              </GlassCard>
            ) : (
              <motion.div
                initial="hidden"
                animate="show"
                variants={{
                  hidden: { opacity: 0 },
                  show: {
                    opacity: 1,
                    transition: { staggerChildren: 0.1 },
                  },
                }}
                className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
              >
                {filtered.map(event => (
                  <EventCard key={event.id} event={event} onSelect={handleSelect} />
                ))}
              </motion.div>
            )}
          </>
        );
      }}
    </LoadingState>
  );
};

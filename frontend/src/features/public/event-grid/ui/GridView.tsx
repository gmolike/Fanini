// frontend/src/features/public/event-grid/ui/GridView.tsx
import { useMemo, useState } from 'react';

import { Filter, Search } from 'lucide-react';

import { usePublicEventList } from '@/entities/public/event';

import { Button, Input } from '@/shared/shadcn';
import { LoadingState } from '@/shared/ui';

import { Card } from './Card';
import { Filters } from './Filters';

/**
 * GridView Feature
 * @description Grid-Ansicht mit Filterung für Events
 */
export const GridView = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [organizerFilter, setOrganizerFilter] = useState<string>('all');

  const eventsQuery = usePublicEventList();

  const filteredEvents = useMemo(() => {
    if (!eventsQuery.data?.data) return [];

    return eventsQuery.data.data.filter(event => {
      const matchesSearch =
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || event.category === categoryFilter;
      const matchesOrganizer = organizerFilter === 'all' || event.organizer === organizerFilter;

      return matchesSearch && matchesCategory && matchesOrganizer;
    });
  }, [eventsQuery.data, searchTerm, categoryFilter, organizerFilter]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setCategoryFilter('all');
    setOrganizerFilter('all');
  };

  return (
    <div className="space-y-6">
      {/* Filter Bar */}
      <div className="bg-card rounded-lg p-4 shadow-sm">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <div className="relative">
            <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
            <Input
              placeholder="Events durchsuchen..."
              value={searchTerm}
              onChange={e => {
                setSearchTerm(e.target.value);
              }}
              className="pl-9"
            />
          </div>

          <Filters
            categoryFilter={categoryFilter}
            organizerFilter={organizerFilter}
            onCategoryChange={setCategoryFilter}
            onOrganizerChange={setOrganizerFilter}
          />

          <Button variant="outline" onClick={handleResetFilters}>
            <Filter className="mr-2 h-4 w-4" />
            Filter zurücksetzen
          </Button>
        </div>
      </div>

      {/* Events Grid */}
      <LoadingState query={eventsQuery}>
        {() => (
          <>
            {filteredEvents.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-muted-foreground">
                  Keine Events gefunden. Versuche andere Filtereinstellungen.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredEvents.map(event => (
                  <Card key={event.id} event={event} />
                ))}
              </div>
            )}
          </>
        )}
      </LoadingState>
    </div>
  );
};

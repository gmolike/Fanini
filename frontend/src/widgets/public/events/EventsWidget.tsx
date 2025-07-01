// frontend/src/widgets/public/events/ui/EventsWidget.tsx
import { useState } from 'react';
import { Calendar, Grid3x3 } from 'lucide-react';

import { Container, PageHeader } from '@/shared/ui/layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/shadcn/tabs';

import { EventsCalendarView } from '@/features/public/event-calendar';
import { EventsGridView } from '@/features/public/event-grid';

/**
 * EventsWidget
 * @description Haupt-Widget für die Events-Seite mit Tab-Navigation
 */
export const EventsWidget = () => {
  const [activeView, setActiveView] = useState<'calendar' | 'grid'>('grid');

  return (
    <>
      <PageHeader
        title="Events & Veranstaltungen"
        description="Alle kommenden Veranstaltungen der Faninitiative und Partner"
        variant="hero"
      />

      <section className="py-8">
        <Container>
          <Tabs value={activeView} onValueChange={v => setActiveView(v as 'calendar' | 'grid')}>
            <TabsList className="mx-auto mb-8 grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="grid" className="flex items-center gap-2">
                <Grid3x3 className="h-4 w-4" />
                Kachelansicht
              </TabsTrigger>
              <TabsTrigger value="calendar" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Kalenderansicht
              </TabsTrigger>
            </TabsList>

            <TabsContent value="grid" className="mt-0">
              <EventsGridView />
            </TabsContent>

            <TabsContent value="calendar" className="mt-0">
              <EventsCalendarView />
            </TabsContent>
          </Tabs>
        </Container>
      </section>
    </>
  );
};

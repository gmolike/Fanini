// frontend/src/widgets/public/events/ui/EventsWidget.tsx
import { useState } from 'react';

import { Calendar, Grid3x3 } from 'lucide-react';

import { EventCalendarView } from '@/features/public/event-calendar';
import { EventGridView } from '@/features/public/event-grid';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/shadcn/tabs';
import { Container, PageHeader } from '@/shared/ui/layout';

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
          <Tabs
            value={activeView}
            onValueChange={v => {
              setActiveView(v as 'calendar' | 'grid');
            }}
          >
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
              <EventGridView />
            </TabsContent>

            <TabsContent value="calendar" className="mt-0">
              <EventCalendarView />
            </TabsContent>
          </Tabs>
        </Container>
      </section>
    </>
  );
};

// frontend/src/widgets/public/events/ui/EventsWidget.tsx

import { Calendar, Grid3x3 } from 'lucide-react';

import { EventCalendarView } from '@/features/public/event-calendar';
import { EventGridView } from '@/features/public/event-grid';

import { ModernTabs } from '@/shared/ui';
import { PageHeader, PageSection } from '@/shared/ui/layout';

/**
 * EventsWidget
 * @description Haupt-Widget für die Events-Seite mit Tab-Navigation
 */
export const EventsWidget = () => {
  const tabs = [
    {
      value: 'calendar',
      label: 'Kalenderansicht',
      icon: Calendar,
      content: <EventCalendarView />,
    },
    {
      value: 'grid',
      label: 'Kachelansicht',
      icon: Grid3x3,
      content: <EventGridView />,
    },
  ];

  return (
    <>
      <PageHeader
        title="Events & Veranstaltungen"
        description="Alle kommenden Veranstaltungen der Faninitiative und Partner"
        variant="hero"
      />

      <PageSection>
        <ModernTabs items={tabs} defaultValue="grid" variant="default" />
      </PageSection>
    </>
  );
};

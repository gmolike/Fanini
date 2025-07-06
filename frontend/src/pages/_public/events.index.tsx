import { createFileRoute } from '@tanstack/react-router';

import { EventWidget } from '@/widgets/public/events';

export const Route = createFileRoute('/_public/events/')({
  component: EventsIndex,
});

function EventsIndex() {
  return <EventWidget />;
}

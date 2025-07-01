import { createFileRoute } from '@tanstack/react-router';

import { EventsWidget } from '@/widgets/public/events';

export const Route = createFileRoute('/_public/event')({
  component: RouteComponent,
});

function RouteComponent() {
  return <EventsWidget />;
}

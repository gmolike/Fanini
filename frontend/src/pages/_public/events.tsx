import { createFileRoute } from '@tanstack/react-router';

import { EventsWidget } from '@/widgets/public/events';

export const Route = createFileRoute('/_public/events')({
  component: RouteComponent,
});

function RouteComponent() {
  return <EventsWidget />;
}

// src/pages/intern/events/_layout.tsx
import { createFileRoute, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/intern/events')({
  component: EventsLayout,
});

function EventsLayout() {
  return <Outlet />;
}

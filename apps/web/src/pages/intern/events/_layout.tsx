// src/pages/intern/events/_layout.tsx
import { createFileRoute, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/intern/events/_layout')({
  component: EventsLayout,
});

function EventsLayout() {
  return <Outlet />;
}

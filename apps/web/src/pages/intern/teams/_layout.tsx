// apps/web/src/pages/intern/teams/_layout.tsx
import { createFileRoute, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/intern/teams/_layout')({
  component: TeamsLayout,
});

function TeamsLayout() {
  return <Outlet />;
}

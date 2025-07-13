import { createFileRoute, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/intern/teams')({
  component: TeamsLayout,
});

function TeamsLayout() {
  return <Outlet />;
}

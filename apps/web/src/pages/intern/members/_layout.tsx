// src/pages/intern/members/_layout.tsx
import { createFileRoute, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/intern/members/_layout')({
  component: MembersLayout,
});

function MembersLayout() {
  return <Outlet />;
}

// src/pages/intern/club/_layout.tsx
import { createFileRoute, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/intern/club')({
  component: ClubLayout,
});

function ClubLayout() {
  return <Outlet />;
}

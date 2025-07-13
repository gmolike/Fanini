// src/pages/intern/creator/_layout.tsx
import { createFileRoute, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/intern/creator/_layout')({
  component: CreatorLayout,
});

function CreatorLayout() {
  return <Outlet />;
}

// src/pages/intern/creator/_layout.tsx
import { createFileRoute, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/intern/creator')({
  component: CreatorLayout,
});

function CreatorLayout() {
  return <Outlet />;
}

// src/pages/intern/settings/_layout.tsx
import { createFileRoute, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/intern/settings/_layout')({
  component: SettingsLayout,
});

function SettingsLayout() {
  return <Outlet />;
}

// pages/_public/kreativ.tsx
import { createFileRoute, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/_public/kreativ')({
  component: KreativLayout,
});

function KreativLayout() {
  return <Outlet />;
}

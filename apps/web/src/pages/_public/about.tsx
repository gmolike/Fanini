// frontend/src/pages/_public/about.tsx
import { createFileRoute, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/_public/about')({
  component: AboutLayout,
});

function AboutLayout() {
  return <Outlet />;
}

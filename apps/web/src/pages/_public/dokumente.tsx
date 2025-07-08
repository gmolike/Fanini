// frontend/src/pages/_public/dokumente.tsx
import { createFileRoute, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/_public/dokumente')({
  component: DokumenteLayout,
});

function DokumenteLayout() {
  return <Outlet />;
}

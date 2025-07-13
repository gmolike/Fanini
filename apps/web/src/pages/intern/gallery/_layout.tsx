// src/pages/intern/gallery/_layout.tsx
import { createFileRoute, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/intern/gallery/_layout')({
  component: GalleryLayout,
});

function GalleryLayout() {
  return <Outlet />;
}

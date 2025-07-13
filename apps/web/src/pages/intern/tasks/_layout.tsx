// apps/web/src/pages/intern/tasks/_layout.tsx
import { createFileRoute, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/intern/tasks/_layout')({
  component: TasksLayout,
});

function TasksLayout() {
  return <Outlet />;
}

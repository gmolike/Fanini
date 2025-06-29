// frontend/src/routes/app/settings.tsx
import { createFileRoute } from '@tanstack/react-router';
import { SettingsPanel } from '@/widgets/settings';

export const Route = createFileRoute('/app/settings')({
  component: SettingsPage,
});

function SettingsPage() {
  return <SettingsPanel />;
}

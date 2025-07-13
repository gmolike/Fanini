import { createFileRoute } from '@tanstack/react-router';

import { DevDashboard } from '@/widgets/internal/dev-dashboard';

export const Route = createFileRoute('/intern/dev/')({
  component: DevIndex,
});

function DevIndex() {
  return <DevDashboard />;
}

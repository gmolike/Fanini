import { createFileRoute } from '@tanstack/react-router';

import { RoadmapWidget } from '@/widgets/internal/roadmap';

export const Route = createFileRoute('/intern/dev/roadmap')({
  component: RoadmapPage,
});

function RoadmapPage() {
  return <RoadmapWidget />;
}

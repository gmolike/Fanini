// frontend/src/pages/_public/historie.$year.$teamType.tsx
import { createFileRoute } from '@tanstack/react-router';

import { TeamHistoryDetailWidget } from '@/widgets/public/team-history-detail';

export const Route = createFileRoute('/_public/historie/$year/$teamType')({
  component: TeamHistoryDetailPage,
});

function TeamHistoryDetailPage() {
  return <TeamHistoryDetailWidget />;
}

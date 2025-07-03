// frontend/src/pages/_public/historie-modern.tsx
import { createFileRoute } from '@tanstack/react-router';

import { TeamHistoryModernWidget } from '@/widgets/public/team-history-modern';

export const Route = createFileRoute('/_public/historie-modern')({
  component: HistorieModernPage,
});

function HistorieModernPage() {
  return <TeamHistoryModernWidget />;
}

// frontend/src/pages/_public/historie.tsx
import { createFileRoute, Outlet, useParams } from '@tanstack/react-router';

import { TeamHistoryWidget } from '@/widgets/public/team-history';

export const Route = createFileRoute('/_public/historie')({
  component: HistoriePage,
});

function HistoriePage() {
  // Prüfe ob es einen newsletterId Parameter gibt
  const params = useParams({ strict: false });

  // Wenn kein newsletterId, zeige die Liste
   
  if (!params.year) {
    return <TeamHistoryWidget />;
  }

  // Sonst zeige das Outlet (Detail-View)
  return <Outlet />;
}

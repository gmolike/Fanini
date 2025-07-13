// apps/web/src/pages/intern/teams/vorstand.tsx
import { createFileRoute } from '@tanstack/react-router';
import { Crown } from 'lucide-react';

import { TeamPage } from '../teams/index';

export const Route = createFileRoute('/intern/teams/vorstand')({
  component: () => (
    <TeamPage
      teamId="vorstand"
      teamName="Vorstand"
      teamDescription="Vereinsführung und strategische Entscheidungen"
      icon={Crown}
      color="from-amber-500 to-amber-600"
      features={[
        'Strategische Planung und Vereinsentwicklung',
        'Finanzübersicht und Budget-Kontrolle',
        'Protokollverwaltung für Vorstandssitzungen',
        'Finale Genehmigung von Events und Ausgaben',
        'Mitgliederverwaltung und Rollenzuweisung',
        'Vereinsdokumente bearbeiten',
      ]}
    />
  ),
});

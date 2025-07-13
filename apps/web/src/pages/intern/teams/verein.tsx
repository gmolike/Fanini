// apps/web/src/pages/intern/teams/verein.tsx
import { createFileRoute } from '@tanstack/react-router';
import { Users } from 'lucide-react';

import { TeamPage } from '../teams/index';

export const Route = createFileRoute('/intern/teams/verein')({
  component: () => (
    <TeamPage
      teamId="verein"
      teamName="Team Verein"
      teamDescription="Verwaltung und interne Kommunikation"
      icon={Users}
      color="from-green-500 to-green-600"
      features={[
        'E-Mail-Vorlagen verwalten',
        'Mitgliedsausweise erstellen',
        'Interne Kommunikation koordinieren',
        'FAQ-Bereich pflegen',
        'Vereinsdokumente organisieren',
        'Mitglieder-Support',
      ]}
    />
  ),
});

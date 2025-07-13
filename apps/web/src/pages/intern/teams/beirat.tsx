// apps/web/src/pages/intern/teams/beirat.tsx
import { createFileRoute } from '@tanstack/react-router';
import { Shield } from 'lucide-react';

import { TeamPage } from './index';

export const Route = createFileRoute('/intern/teams/beirat')({
  component: () => (
    <TeamPage
      teamId="beirat"
      teamName="Beirat"
      teamDescription="Beratung und Unterstützung des Vorstands"
      icon={Shield}
      color="from-blue-500 to-blue-600"
      features={[
        'Event-Genehmigungen und Kontrolle',
        'Ausgaben-Genehmigungen',
        'Mitglieder-Verwaltung',
        'Rollen und Berechtigungen zuweisen',
        'Protokolle erstellen und verwalten',
        'Creator-Autorisierungen',
      ]}
    />
  ),
});

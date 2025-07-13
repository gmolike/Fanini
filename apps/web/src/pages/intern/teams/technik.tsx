// apps/web/src/pages/intern/teams/technik.tsx
import { createFileRoute } from '@tanstack/react-router';
import { Laptop } from 'lucide-react';

import { TeamPage } from './index';

export const Route = createFileRoute('/intern/teams/technik')({
  component: () => (
    <TeamPage
      teamId="technik"
      teamName="Team Technik"
      teamDescription="IT-Support und technische Infrastruktur"
      icon={Laptop}
      color="from-indigo-500 to-indigo-600"
      features={[
        'System-Überwachung und Monitoring',
        'Backup-Verwaltung',
        'Technischer Support für Mitglieder',
        'API-Integrationen pflegen',
        'Sicherheits-Updates',
        'Performance-Optimierung',
      ]}
    />
  ),
});

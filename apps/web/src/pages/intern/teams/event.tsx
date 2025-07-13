// apps/web/src/pages/intern/teams/event.tsx
import { createFileRoute } from '@tanstack/react-router';
import { Calendar } from 'lucide-react';

import { TeamPage } from './index';

export const Route = createFileRoute('/intern/teams/event')({
  component: () => (
    <TeamPage
      teamId="event"
      teamName="Team Event"
      teamDescription="Planung und Durchführung von Veranstaltungen"
      icon={Calendar}
      color="from-purple-500 to-purple-600"
      features={[
        'Event-Erstellung und -Bearbeitung',
        'Aufgabenverteilung für Events',
        'Teilnehmerverwaltung',
        'Budget-Planung pro Event',
        'Event-Status Workflow',
        'Koordination mit anderen Teams',
      ]}
    />
  ),
});

// apps/web/src/pages/intern/teams/medien.tsx
import { createFileRoute } from '@tanstack/react-router';
import { Camera } from 'lucide-react';

import { TeamPage } from './index';

export const Route = createFileRoute('/intern/teams/medien')({
  component: () => (
    <TeamPage
      teamId="medien"
      teamName="Team Medien"
      teamDescription="Social Media, Fotos und Öffentlichkeitsarbeit"
      icon={Camera}
      color="from-pink-500 to-pink-600"
      features={[
        'Social Media Post-Planung',
        'Creator-Profile verwalten',
        'Mediengalerie pflegen',
        'Newsletter erstellen',
        'Event-Marketing koordinieren',
        'Foto- und Video-Upload',
      ]}
    />
  ),
});

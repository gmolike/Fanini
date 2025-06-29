// frontend/src/features/settings/ManageFeatureFlags/ManageFeatureFlags.tsx
// Feature flags component

import { useSettings, useUpdateSettings } from '@/entities/settings';
import type { Features } from '@/entities/settings';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Switch,
  Label,
} from '@/shared/shadcn';
import { Calendar, Users, Image } from 'lucide-react';

const FEATURE_CONFIG = {
  events: {
    label: 'Events',
    description: 'Event-Verwaltung und Anmeldungen aktivieren',
    icon: Calendar,
  },
  members: {
    label: 'Mitglieder',
    description: 'Mitgliederverwaltung und Profile aktivieren',
    icon: Users,
  },
  gallery: {
    label: 'Galerie',
    description: 'Foto-Galerie und Uploads aktivieren',
    icon: Image,
  },
} as const;

export const ManageFeatureFlags = () => {
  const { data: settings } = useSettings();
  const updateSettings = useUpdateSettings();

  if (!settings) return null;

  const handleToggle = async (feature: keyof Features, enabled: boolean) => {
    await updateSettings.mutateAsync({
      features: {
        ...settings.features,
        [feature]: enabled,
      },
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Features verwalten</CardTitle>
        <CardDescription>Aktiviere oder deaktiviere Funktionen für deine Webseite</CardDescription>
      </CardHeader>
      <CardContent className='space-y-6'>
        {(Object.keys(FEATURE_CONFIG) as Array<keyof Features>).map(feature => {
          const config = FEATURE_CONFIG[feature];
          const Icon = config.icon;
          const isEnabled = settings.features[feature];

          return (
            <div key={feature} className='flex items-center justify-between space-x-4'>
              <div className='flex items-center space-x-4'>
                <div className='bg-muted rounded-lg p-2'>
                  <Icon className='h-5 w-5' />
                </div>
                <div className='space-y-1'>
                  <Label htmlFor={feature} className='text-base'>
                    {config.label}
                  </Label>
                  <p className='text-muted-foreground text-sm'>{config.description}</p>
                </div>
              </div>
              <Switch
                id={feature}
                checked={isEnabled}
                onCheckedChange={checked => handleToggle(feature, checked)}
                disabled={updateSettings.isPending}
              />
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

// frontend/src/pages/~app/~index.tsx
import { createFileRoute } from '@tanstack/react-router';
import { Settings, Palette, ToggleLeft, Shield } from 'lucide-react';

import { useSettings } from '@/entities/settings';

import { Button, Card, CardContent, CardHeader, CardTitle } from '@shared/shadcn';

export const Route = createFileRoute('/app/')({
  component: DashboardPage,
});

function DashboardPage() {
  const { data: settings } = useSettings();

  return (
    <div className='space-y-8'>
      {/* Welcome Banner */}
      <div
        className='rounded-xl p-8 text-white shadow-xl'
        style={{ backgroundColor: 'var(--color-fanini-blue)' }}
      >
        <h1 className='mb-2 text-3xl font-bold'>Willkommen im Verwaltungsbereich!</h1>
        <p className='opacity-80'>Verwalte hier die Einstellungen deiner Vereinswebseite.</p>
      </div>

      {/* Stats Grid */}
      <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-4'>
        {[
          {
            title: 'Primärfarbe',
            value: settings?.branding.colors.primary || '#34687e',
            desc: 'Vereinsfarbe',
            icon: Palette,
            isColor: true,
          },
          {
            title: 'Features Aktiv',
            value: settings ? Object.values(settings.features).filter(Boolean).length : 0,
            desc: `von ${settings ? Object.keys(settings.features).length : 3} verfügbar`,
            icon: ToggleLeft,
            color: 'var(--color-fanini-blue)',
          },
          {
            title: 'Letzte Änderung',
            value: settings ? new Date(settings.updatedAt).toLocaleDateString('de-DE') : '-',
            desc: 'Einstellungen',
            icon: Settings,
            color: 'var(--color-warning)',
          },
          {
            title: 'Status',
            value: 'Aktiv',
            desc: 'System läuft',
            icon: Shield,
            color: 'var(--color-success)',
          },
        ].map(stat => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>{stat.title}</CardTitle>
                {stat.isColor ? (
                  <div className='h-4 w-4 rounded border' style={{ backgroundColor: stat.value }} />
                ) : (
                  <Icon className='h-4 w-4' style={{ color: stat.color }} />
                )}
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>
                  {stat.isColor ? (
                    <span className='font-mono text-sm'>{stat.value}</span>
                  ) : (
                    stat.value
                  )}
                </div>
                <p className='text-xs text-[var(--color-muted-foreground)]'>{stat.desc}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className='grid gap-6 md:grid-cols-2'>
        <Card>
          <CardHeader>
            <CardTitle>Schnellzugriff</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='space-y-2'>
              <Button
                className='w-full justify-start'
                variant='outline'
                onClick={() => (window.location.href = '/app/settings')}
              >
                <Palette className='mr-2 h-4 w-4' />
                Branding anpassen
              </Button>
              <Button
                className='w-full justify-start'
                variant='outline'
                onClick={() => (window.location.href = '/app/settings?tab=features')}
              >
                <ToggleLeft className='mr-2 h-4 w-4' />
                Features verwalten
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Aktuelle Einstellungen</CardTitle>
          </CardHeader>
          <CardContent className='space-y-3'>
            {settings ? <>
                <div className='flex items-center justify-between'>
                  <span className='text-sm text-[var(--color-muted-foreground)]'>Events</span>
                  <span
                    className={`text-sm font-medium ${settings.features.events ? 'text-green-600' : 'text-red-600'}`}
                  >
                    {settings.features.events ? 'Aktiviert' : 'Deaktiviert'}
                  </span>
                </div>
                <div className='flex items-center justify-between'>
                  <span className='text-sm text-[var(--color-muted-foreground)]'>Mitglieder</span>
                  <span
                    className={`text-sm font-medium ${settings.features.members ? 'text-green-600' : 'text-red-600'}`}
                  >
                    {settings.features.members ? 'Aktiviert' : 'Deaktiviert'}
                  </span>
                </div>
                <div className='flex items-center justify-between'>
                  <span className='text-sm text-[var(--color-muted-foreground)]'>Galerie</span>
                  <span
                    className={`text-sm font-medium ${settings.features.gallery ? 'text-green-600' : 'text-red-600'}`}
                  >
                    {settings.features.gallery ? 'Aktiviert' : 'Deaktiviert'}
                  </span>
                </div>
              </> : null}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

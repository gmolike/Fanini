import { createFileRoute } from '@tanstack/react-router';
import { Calendar, Users, Trophy, TrendingUp } from 'lucide-react';
import { Button, Card, CardContent, CardHeader, CardTitle } from '@shared/shadcn';

export const Route = createFileRoute('/app/')({
  component: DashboardPage,
});

function DashboardPage() {
  return (
    <div className='space-y-8'>
      {/* Welcome Banner */}
      <div
        className='rounded-xl p-8 text-white shadow-xl'
        style={{ backgroundColor: 'var(--color-fanini-blue)' }}
      >
        <h1 className='mb-2 text-3xl font-bold'>Willkommen zurück, Max!</h1>
        <p className='opacity-80'>
          Schön, dass du wieder da bist. Hier ist was in der Faninitiative los ist.
        </p>
      </div>

      {/* Stats Grid */}
      <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-4'>
        {[
          {
            title: 'Anstehende Events',
            value: '5',
            desc: '+2 neu diese Woche',
            icon: Calendar,
            color: 'var(--color-fanini-blue)',
          },
          {
            title: 'Aktive Mitglieder',
            value: '156',
            desc: '+12 diesen Monat',
            icon: Users,
            color: 'var(--color-fanini-red)',
          },
          {
            title: 'Tabellenplatz',
            value: '3.',
            desc: 'Regionalliga',
            icon: Trophy,
            color: 'var(--color-warning)',
          },
          {
            title: 'Event-Teilnahme',
            value: '89%',
            desc: '↑ 12% im Vergleich',
            icon: TrendingUp,
            color: 'var(--color-success)',
          },
        ].map(stat => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>{stat.title}</CardTitle>
                <Icon className='h-4 w-4' style={{ color: stat.color }} />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>{stat.value}</div>
                <p className='text-xs text-[var(--color-muted-foreground)]'>{stat.desc}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Next Events */}
      <Card>
        <CardHeader>
          <CardTitle>Nächste Events</CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          {[
            {
              date: '28',
              month: 'JAN',
              title: 'Rückrundenstart-Party',
              time: '19:00 Uhr • Vereinsheim',
              color: 'var(--color-fanini-red)',
            },
            {
              date: '14',
              month: 'FEB',
              title: 'Auswärtsfahrt Berlin',
              time: '14:00 Uhr • Busabfahrt',
              color: 'var(--color-fanini-blue)',
            },
          ].map((event, i) => (
            <div
              key={`${event.title}-${event.date}`}
              className='flex items-center gap-4 rounded-lg bg-[var(--color-muted)] p-4'
            >
              <div
                className='min-w-[60px] rounded-lg p-3 text-center text-white'
                style={{ backgroundColor: event.color }}
              >
                <div className='text-xl font-bold'>{event.date}</div>
                <div className='text-xs'>{event.month}</div>
              </div>
              <div className='flex-1'>
                <h3 className='font-semibold'>{event.title}</h3>
                <p className='text-sm text-[var(--color-muted-foreground)]'>{event.time}</p>
              </div>
              <Button
                variant={i === 0 ? 'outline' : 'default'}
                size='sm'
                style={i === 1 ? { backgroundColor: 'var(--color-fanini-blue)' } : {}}
              >
                {i === 0 ? 'Details' : 'Anmelden'}
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

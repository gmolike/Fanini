// frontend/src/pages/~app/~index.tsx
import { createFileRoute } from '@tanstack/react-router';
import {
  Calendar,
  Users,
  Trophy,
  TrendingUp,
  Activity,
  Plus,
  Camera,
  FileText,
} from 'lucide-react';
import { Badge } from '@/shared/shadcn/badge';
import { Button } from '@/shared/shadcn/button';

export const Route = createFileRoute('/app/')({
  component: DashboardPage,
});

function DashboardPage() {
  return (
    <div className='space-y-8 p-8'>
      {/* Welcome Section */}
      <div className='from-fanini-blue-500 to-fanini-blue-600 rounded-2xl bg-gradient-to-r p-8 text-white shadow-xl'>
        <h1 className='mb-2 text-3xl font-bold'>Willkommen zurück, Max!</h1>
        <p className='text-white/80'>
          Schön, dass du wieder da bist. Hier ist was in der Faninitiative los ist.
        </p>
      </div>

      {/* Quick Stats */}
      <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-4'>
        <div className='bg-card rounded-xl border p-6 shadow-sm transition-shadow hover:shadow-md'>
          <div className='mb-4 flex items-center justify-between'>
            <div className='bg-fanini-blue-100 rounded-lg p-3'>
              <Calendar className='text-fanini-blue-600 h-6 w-6' />
            </div>
            <Badge variant='secondary' className='bg-green-100 text-green-700'>
              +2 neu
            </Badge>
          </div>
          <div className='text-2xl font-bold'>5</div>
          <div className='text-muted-foreground text-sm'>Anstehende Events</div>
        </div>

        <div className='bg-card rounded-xl border p-6 shadow-sm transition-shadow hover:shadow-md'>
          <div className='mb-4 flex items-center justify-between'>
            <div className='bg-fanini-red-100 rounded-lg p-3'>
              <Users className='text-fanini-red-600 h-6 w-6' />
            </div>
          </div>
          <div className='text-2xl font-bold'>156</div>
          <div className='text-muted-foreground text-sm'>Aktive Mitglieder</div>
        </div>

        <div className='bg-card rounded-xl border p-6 shadow-sm transition-shadow hover:shadow-md'>
          <div className='mb-4 flex items-center justify-between'>
            <div className='rounded-lg bg-amber-100 p-3'>
              <Trophy className='h-6 w-6 text-amber-600' />
            </div>
          </div>
          <div className='text-2xl font-bold'>3.</div>
          <div className='text-muted-foreground text-sm'>Tabellenplatz</div>
        </div>

        <div className='bg-card rounded-xl border p-6 shadow-sm transition-shadow hover:shadow-md'>
          <div className='mb-4 flex items-center justify-between'>
            <div className='rounded-lg bg-green-100 p-3'>
              <TrendingUp className='h-6 w-6 text-green-600' />
            </div>
            <Badge variant='secondary' className='bg-green-100 text-green-700'>
              ↑ 12%
            </Badge>
          </div>
          <div className='text-2xl font-bold'>89%</div>
          <div className='text-muted-foreground text-sm'>Event-Teilnahme</div>
        </div>
      </div>

      {/* Content Grid */}
      <div className='grid gap-8 lg:grid-cols-3'>
        {/* Upcoming Events */}
        <div className='space-y-6 lg:col-span-2'>
          <div className='bg-card rounded-xl border shadow-sm'>
            <div className='border-b p-6'>
              <h2 className='flex items-center gap-2 text-xl font-semibold'>
                <Calendar className='text-fanini-blue-600 h-5 w-5' />
                Nächste Events
              </h2>
            </div>
            <div className='space-y-4 p-6'>
              {/* Event Item 1 */}
              <div className='bg-fanini-blue-50 border-fanini-blue-200 flex items-start gap-4 rounded-lg border p-4'>
                <div className='bg-fanini-blue-600 min-w-[60px] rounded-lg p-3 text-center text-white'>
                  <div className='text-xl font-bold'>28</div>
                  <div className='text-xs'>JAN</div>
                </div>
                <div className='flex-1'>
                  <h3 className='text-fanini-blue-900 font-semibold'>Rückrundenstart-Party</h3>
                  <p className='text-fanini-blue-700 mt-1 text-sm'>19:00 Uhr • Vereinsheim</p>
                  <div className='mt-2 flex gap-2'>
                    <Badge className='bg-fanini-blue-600'>Party</Badge>
                    <Badge variant='outline'>32 Teilnehmer</Badge>
                  </div>
                </div>
                <Button size='sm' variant='ghost' className='text-fanini-blue-600'>
                  Details →
                </Button>
              </div>

              {/* Event Item 2 */}
              <div className='bg-fanini-red-50 border-fanini-red-200 flex items-start gap-4 rounded-lg border p-4'>
                <div className='bg-fanini-red-600 min-w-[60px] rounded-lg p-3 text-center text-white'>
                  <div className='text-xl font-bold'>14</div>
                  <div className='text-xs'>FEB</div>
                </div>
                <div className='flex-1'>
                  <h3 className='text-fanini-red-900 font-semibold'>Auswärtsfahrt Berlin</h3>
                  <p className='text-fanini-red-700 mt-1 text-sm'>14:00 Uhr • Busabfahrt</p>
                  <div className='mt-2 flex gap-2'>
                    <Badge className='bg-fanini-red-600'>Auswärts</Badge>
                    <Badge variant='outline'>18/50 Plätze</Badge>
                  </div>
                </div>
                <Button size='sm' className='bg-fanini-red-600 hover:bg-fanini-red-700'>
                  Anmelden
                </Button>
              </div>

              <Button variant='outline' className='w-full'>
                Alle Events anzeigen
              </Button>
            </div>
          </div>

          {/* Recent Activities */}
          <div className='bg-card rounded-xl border shadow-sm'>
            <div className='border-b p-6'>
              <h2 className='flex items-center gap-2 text-xl font-semibold'>
                <Activity className='text-fanini-blue-600 h-5 w-5' />
                Letzte Aktivitäten
              </h2>
            </div>
            <div className='space-y-4 p-6'>
              {[
                {
                  user: 'Sarah M.',
                  action: "hat sich für 'Auswärtsfahrt Berlin' angemeldet",
                  time: 'vor 2 Stunden',
                },
                { user: 'Tom K.', action: 'hat neue Fotos hochgeladen', time: 'vor 5 Stunden' },
                { user: 'Lisa F.', action: 'hat einen Rückblick geschrieben', time: 'gestern' },
              ].map((activity, i) => (
                <div key={i} className='flex items-start gap-3'>
                  <div className='bg-fanini-blue-100 text-fanini-blue-600 flex h-10 w-10 items-center justify-center rounded-full font-semibold'>
                    {activity.user[0]}
                  </div>
                  <div className='flex-1'>
                    <p className='text-sm'>
                      <span className='font-semibold'>{activity.user}</span> {activity.action}
                    </p>
                    <p className='text-muted-foreground mt-0.5 text-xs'>{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className='space-y-6'>
          {/* Quick Actions */}
          <div className='bg-card rounded-xl border p-6 shadow-sm'>
            <h2 className='mb-4 text-lg font-semibold'>Schnellaktionen</h2>
            <div className='space-y-3'>
              <Button className='w-full justify-start' variant='outline'>
                <Plus className='mr-2 h-4 w-4' />
                Neues Event erstellen
              </Button>
              <Button className='w-full justify-start' variant='outline'>
                <Camera className='mr-2 h-4 w-4' />
                Fotos hochladen
              </Button>
              <Button className='w-full justify-start' variant='outline'>
                <FileText className='mr-2 h-4 w-4' />
                Rückblick schreiben
              </Button>
            </div>
          </div>

          {/* Next Match */}
          <div className='from-fanini-blue-600 to-fanini-blue-700 rounded-xl bg-gradient-to-br p-6 text-white'>
            <h3 className='mb-4 text-lg font-semibold'>Nächstes Spiel</h3>
            <div className='mb-4 text-center'>
              <div className='text-sm opacity-80'>Samstag, 03.02.2024</div>
              <div className='mt-2 text-2xl font-bold'>15:30 Uhr</div>
            </div>
            <div className='flex items-center justify-between text-center'>
              <div className='flex-1'>
                <div className='text-xs opacity-80'>Heim</div>
                <div className='font-bold'>Eintracht</div>
              </div>
              <div className='px-4 text-2xl font-bold'>VS</div>
              <div className='flex-1'>
                <div className='text-xs opacity-80'>Gast</div>
                <div className='font-bold'>TuS Mitte</div>
              </div>
            </div>
            <Button className='text-fanini-blue-600 mt-4 w-full bg-white hover:bg-gray-100'>
              Zum Spielplan
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

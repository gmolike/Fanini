import { createFileRoute } from '@tanstack/react-router';
import { Calendar, Clock, Filter, MapPin, Plus,Users } from 'lucide-react';

import { Badge } from '@/shared/shadcn/badge';
import { Button } from '@/shared/shadcn/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/shadcn/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/shadcn/dropdown-menu';

export const Route = createFileRoute('/intern/events')({
  component: EventsPage,
});

function EventsPage() {
  const events = [
    {
      id: 1,
      title: 'Rückrundenstart-Party',
      date: '28.01.2024',
      time: '19:00',
      location: 'Vereinsheim',
      type: 'party',
      participants: 32,
      maxParticipants: 50,
      description: 'Gemeinsam in die zweite Saisonhälfte! Mit Live-Musik und Überraschungsgästen.',
      status: 'upcoming',
    },
    {
      id: 2,
      title: 'Auswärtsfahrt Berlin',
      date: '14.02.2024',
      time: '14:00',
      location: 'Busabfahrt Rathaus',
      type: 'away',
      participants: 18,
      maxParticipants: 50,
      description: 'Zusammen zum Derby! Busfahrt, Stadionbesuch und After-Match-Party inklusive.',
      status: 'upcoming',
    },
    {
      id: 3,
      title: 'Mitgliederversammlung',
      date: '01.03.2024',
      time: '18:30',
      location: 'Vereinsheim',
      type: 'meeting',
      participants: 45,
      description: 'Jahreshauptversammlung mit Vorstandswahlen und Rückblick auf 2023.',
      status: 'upcoming',
    },
  ];

  const typeColors = {
    party: { bg: 'bg-purple-100', text: 'text-purple-700', label: 'Party' },
    away: { bg: 'bg-fanini-red-100', text: 'text-fanini-red-700', label: 'Auswärtsfahrt' },
    meeting: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Versammlung' },
    match: { bg: 'bg-green-100', text: 'text-green-700', label: 'Spieltag' },
  };

  return (
    <div className="space-y-6 p-8">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-fanini-blue-700 text-3xl font-bold">Events</h1>
          <p className="text-muted-foreground mt-1">Alle Vereinsveranstaltungen auf einen Blick</p>
        </div>
        <div className="flex items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Event-Typ</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Alle anzeigen</DropdownMenuItem>
              <DropdownMenuItem>Nur Partys</DropdownMenuItem>
              <DropdownMenuItem>Nur Auswärtsfahrten</DropdownMenuItem>
              <DropdownMenuItem>Nur Versammlungen</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button className="bg-fanini-blue-600 hover:bg-fanini-blue-700">
            <Plus className="mr-2 h-4 w-4" />
            Event erstellen
          </Button>
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {events.map(event => {
          const typeStyle = typeColors[event.type as keyof typeof typeColors];
          const participationRate = event.maxParticipants
            ? (event.participants / event.maxParticipants) * 100
            : 0;

          return (
            <Card
              key={event.id}
              className="group overflow-hidden transition-all duration-300 hover:shadow-lg"
            >
              {/* Event Type Banner */}
              <div
                className={`h-2 ${event.type === 'away' ? 'bg-fanini-red-500' : 'bg-fanini-blue-500'}`}
              />

              <CardHeader className="pb-4">
                <div className="mb-2 flex items-start justify-between">
                  <Badge className={`${typeStyle.bg} ${typeStyle.text} border-0`}>
                    {typeStyle.label}
                  </Badge>
                  {event.status === 'upcoming' && (
                    <Badge
                      variant="outline"
                      className="border-green-200 bg-green-50 text-green-700"
                    >
                      Anstehend
                    </Badge>
                  )}
                </div>
                <CardTitle className="group-hover:text-fanini-blue-600 text-xl transition-colors">
                  {event.title}
                </CardTitle>
                <CardDescription className="mt-2 line-clamp-2">{event.description}</CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Event Details */}
                <div className="space-y-2 text-sm">
                  <div className="text-muted-foreground flex items-center gap-2">
                    <Calendar className="text-fanini-blue-600 h-4 w-4" />
                    <span>{event.date}</span>
                  </div>
                  <div className="text-muted-foreground flex items-center gap-2">
                    <Clock className="text-fanini-blue-600 h-4 w-4" />
                    <span>{event.time} Uhr</span>
                  </div>
                  <div className="text-muted-foreground flex items-center gap-2">
                    <MapPin className="text-fanini-blue-600 h-4 w-4" />
                    <span>{event.location}</span>
                  </div>
                  <div className="text-muted-foreground flex items-center gap-2">
                    <Users className="text-fanini-blue-600 h-4 w-4" />
                    <span>
                      {event.participants}
                      {event.maxParticipants
                        ? ` / ${event.maxParticipants.toLocaleString()}`
                        : null}{' '}
                      Teilnehmer
                    </span>
                  </div>
                </div>

                {/* Participation Progress */}
                {event.maxParticipants ? (
                  <div className="space-y-2">
                    <div className="text-muted-foreground flex justify-between text-xs">
                      <span>Teilnehmer</span>
                      <span>{Math.round(participationRate)}%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-gray-200">
                      {(() => {
                        let progressBarColor = 'bg-fanini-blue-500';
                        if (participationRate > 80) {
                          progressBarColor = 'bg-fanini-red-500';
                        } else if (participationRate > 50) {
                          progressBarColor = 'bg-amber-500';
                        }
                        return (
                          <div
                            className={`h-full transition-all duration-500 ${progressBarColor}`}
                            style={{ width: `${participationRate.toString()}%` }}
                          />
                        );
                      })()}
                    </div>
                  </div>
                ) : null}

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Button
                    className="bg-fanini-blue-600 hover:bg-fanini-blue-700 flex-1"
                    disabled={
                      !!event.maxParticipants && event.participants >= event.maxParticipants
                    }
                  >
                    {event.maxParticipants && event.participants >= event.maxParticipants
                      ? 'Ausgebucht'
                      : 'Teilnehmen'}
                  </Button>
                  <Button variant="outline" size="icon">
                    <span className="sr-only">Mehr Optionen</span>
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                      />
                    </svg>
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Calendar View Toggle */}
      <div className="flex justify-center pt-8">
        <Button variant="outline" size="lg">
          <Calendar className="mr-2 h-4 w-4" />
          Kalenderansicht
        </Button>
      </div>
    </div>
  );
}

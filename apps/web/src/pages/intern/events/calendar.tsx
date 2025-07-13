// src/pages/intern/events/calendar.tsx
import { createFileRoute } from '@tanstack/react-router';
import { Calendar as CalendarIcon, Grid3x3, List } from 'lucide-react';

import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/shadcn';
import { Container } from '@/shared/ui';

export const Route = createFileRoute('/intern/events/calendar')({
  component: EventCalendarPage,
});

function EventCalendarPage() {
  return (
    <Container className="py-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[var(--color-fanini-blue)]">Event-Kalender</h1>
            <p className="text-muted-foreground mt-2">Alle Vereinsevents in der Kalenderansicht</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <List className="mr-2 h-4 w-4" />
              Listenansicht
            </Button>
            <Button variant="outline">
              <Grid3x3 className="mr-2 h-4 w-4" />
              Monatsansicht
            </Button>
          </div>
        </div>

        {/* Coming Soon Card */}
        <Card className="border-2 border-dashed">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 inline-flex rounded-full bg-gradient-to-r from-[var(--color-fanini-blue)] to-[var(--color-fanini-red)] p-4">
              <CalendarIcon className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl">Kalenderansicht entsteht...</CardTitle>
            <CardDescription className="mx-auto mt-2 max-w-2xl">
              Ein interaktiver Kalender mit verschiedenen Ansichten und Filter-Optionen für die
              optimale Event-Übersicht.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="text-center">
                <div className="mb-2 text-4xl">📅</div>
                <p className="font-medium">Monatsansicht</p>
                <p className="text-muted-foreground text-xs">Klassischer Kalender</p>
              </div>
              <div className="text-center">
                <div className="mb-2 text-4xl">📋</div>
                <p className="font-medium">Listenansicht</p>
                <p className="text-muted-foreground text-xs">Chronologische Liste</p>
              </div>
              <div className="text-center">
                <div className="mb-2 text-4xl">🗓️</div>
                <p className="font-medium">Jahresübersicht</p>
                <p className="text-muted-foreground text-xs">Langfristplanung</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Features */}
        <Card>
          <CardHeader>
            <CardTitle>Kalender-Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2 md:grid-cols-2">
              <div>
                <p className="mb-2 text-sm font-medium">Ansichten</p>
                <ul className="text-muted-foreground space-y-1 text-sm">
                  <li>• Tag, Woche, Monat, Jahr</li>
                  <li>• Liste mit Filterung</li>
                  <li>• Agenda-Ansicht</li>
                </ul>
              </div>
              <div>
                <p className="mb-2 text-sm font-medium">Funktionen</p>
                <ul className="text-muted-foreground space-y-1 text-sm">
                  <li>• Event-Filter nach Typ</li>
                  <li>• Team-spezifische Ansichten</li>
                  <li>• Export-Funktionen</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Container>
  );
}

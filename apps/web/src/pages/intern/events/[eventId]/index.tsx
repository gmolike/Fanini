// src/pages/intern/events/[eventId]/index.tsx
import { createFileRoute, Link, useParams } from '@tanstack/react-router';
import { Calendar, Clock, Edit, MapPin, Users } from 'lucide-react';

import { Badge, Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/shadcn';
import { Container } from '@/shared/ui';

export const Route = createFileRoute('/intern/events/$eventId/')({
  component: EventDetailPage,
});

function EventDetailPage() {
  const { eventId } = useParams({ from: '/intern/events/$eventId/' });

  return (
    <Container className="py-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[var(--color-fanini-blue)]">Event-Details</h1>
            <p className="text-muted-foreground mt-2">
              Event ID: {eventId}
            </p>
          </div>
          <div className="flex gap-2">
            <Button asChild variant="outline">
              <Link to={`/intern/events/${eventId}/edit`}>
                <Edit className="mr-2 h-4 w-4" />
                Bearbeiten
              </Link>
            </Button>
            <Button asChild>
              <Link to={`/intern/events/${eventId}/tasks`}>
                Aufgaben verwalten
              </Link>
            </Button>
          </div>
        </div>

        {/* Coming Soon Card */}
        <Card className="border-dashed border-2">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 inline-flex rounded-full bg-gradient-to-r from-[var(--color-fanini-blue)] to-[var(--color-fanini-red)] p-4">
              <Calendar className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl">Event-Detailansicht entsteht...</CardTitle>
            <CardDescription className="max-w-2xl mx-auto mt-2">
              Umfassende Übersicht über alle Event-Details mit Teilnehmerverwaltung,
              Budget-Tracking und Status-Workflow.
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Preview Sections */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Event-Informationen</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-[var(--color-fanini-blue)]" />
                <span>Datum & Zeit</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-[var(--color-fanini-blue)]" />
                <span>Veranstaltungsort</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Users className="h-4 w-4 text-[var(--color-fanini-blue)]" />
                <span>Teilnehmer</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-[var(--color-fanini-blue)]" />
                <span>Status & Workflow</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Funktionen</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Badge variant="outline" className="mr-2">Teilnehmerliste</Badge>
              <Badge variant="outline" className="mr-2">Aufgaben-Übersicht</Badge>
              <Badge variant="outline" className="mr-2">Budget-Tracking</Badge>
              <Badge variant="outline" className="mr-2">Kommentare</Badge>
              <Badge variant="outline" className="mr-2">Status-Historie</Badge>
              <Badge variant="outline" className="mr-2">Export-Optionen</Badge>
            </CardContent>
          </Card>
        </div>
      </div>
    </Container>
  );
}

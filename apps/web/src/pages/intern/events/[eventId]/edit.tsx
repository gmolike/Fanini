// src/pages/intern/events/[eventId]/edit.tsx
import { createFileRoute, useParams } from '@tanstack/react-router';
import { Save, X } from 'lucide-react';

import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/shadcn';
import { Container } from '@/shared/ui';

export const Route = createFileRoute('/intern/events/[eventId]/edit')({
  component: EditEventPage,
});

function EditEventPage() {
  const { eventId } = useParams({ from: '/intern/events/$eventId/edit' });

  return (
    <Container className="py-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[var(--color-fanini-blue)]">Event bearbeiten</h1>
            <p className="text-muted-foreground mt-2">Bearbeite Event ID: {eventId}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <X className="mr-2 h-4 w-4" />
              Abbrechen
            </Button>
            <Button className="bg-gradient-to-r from-[var(--color-fanini-blue)] to-[var(--color-fanini-red)]">
              <Save className="mr-2 h-4 w-4" />
              Speichern
            </Button>
          </div>
        </div>

        {/* Coming Soon Card */}
        <Card className="border-2 border-dashed">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Event-Bearbeitung entsteht...</CardTitle>
            <CardDescription className="mx-auto mt-2 max-w-2xl">
              Bearbeite alle Event-Details mit Validierung und Änderungshistorie.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-center text-sm">
              Das Bearbeitungsformular wird ähnlich wie die Erstellung aufgebaut sein, mit allen
              Feldern vorausgefüllt.
            </p>
          </CardContent>
        </Card>
      </div>
    </Container>
  );
}

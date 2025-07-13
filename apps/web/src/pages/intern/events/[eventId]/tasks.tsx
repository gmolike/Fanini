// src/pages/intern/events/[eventId]/tasks.tsx
import { createFileRoute, useParams } from '@tanstack/react-router';
import { CheckSquare, ListTodo, Plus, Users } from 'lucide-react';

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

export const Route = createFileRoute('/intern/events/$eventId/tasks')({
  component: EventTasksPage,
});

function EventTasksPage() {
  const { eventId } = useParams({ from: '/intern/events/$eventId/tasks' });

  return (
    <Container className="py-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[var(--color-fanini-blue)]">Event-Aufgaben</h1>
            <p className="text-muted-foreground mt-2">Aufgabenverwaltung für Event ID: {eventId}</p>
          </div>
          <Button className="bg-gradient-to-r from-[var(--color-fanini-blue)] to-[var(--color-fanini-red)]">
            <Plus className="mr-2 h-4 w-4" />
            Aufgabe hinzufügen
          </Button>
        </div>

        {/* Coming Soon Card */}
        <Card className="border-2 border-dashed">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 inline-flex rounded-full bg-gradient-to-r from-[var(--color-fanini-blue)] to-[var(--color-fanini-red)] p-4">
              <ListTodo className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl">Event-Aufgabenverwaltung entsteht...</CardTitle>
            <CardDescription className="mx-auto mt-2 max-w-2xl">
              Verwalte alle Aufgaben für dieses Event, weise sie Mitgliedern zu und tracke den
              Fortschritt.
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Features Preview */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckSquare className="h-5 w-5 text-[var(--color-fanini-blue)]" />
                Aufgaben-Features
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Badge variant="outline" className="mr-2">
                Aufgaben erstellen
              </Badge>
              <Badge variant="outline" className="mr-2">
                Zuweisungen
              </Badge>
              <Badge variant="outline" className="mr-2">
                Prioritäten
              </Badge>
              <Badge variant="outline" className="mr-2">
                Fristen
              </Badge>
              <Badge variant="outline" className="mr-2">
                Kategorien
              </Badge>
              <Badge variant="outline" className="mr-2">
                Checklisten
              </Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-[var(--color-fanini-blue)]" />
                Team-Koordination
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-muted-foreground mb-2 text-sm">
                Effiziente Zusammenarbeit im Team
              </p>
              <div className="space-y-1 text-sm">
                <div>• Aufgabenverteilung visualisieren</div>
                <div>• Workload balancieren</div>
                <div>• Abhängigkeiten verwalten</div>
                <div>• Fortschritt tracken</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Container>
  );
}

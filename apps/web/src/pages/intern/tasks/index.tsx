// apps/web/src/pages/intern/tasks/index.tsx
import { createFileRoute } from '@tanstack/react-router';
import { AlertCircle,CheckCircle2, Clock, ListTodo } from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/shadcn/card';
import { Container } from '@/shared/ui';

export const Route = createFileRoute('/intern/tasks/')({
  component: MyTasksPage,
});

function MyTasksPage() {
  return (
    <Container className="py-8">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-[var(--color-fanini-blue)]">Meine Aufgaben</h1>
          <p className="text-muted-foreground mt-2">
            Hier siehst du alle dir zugewiesenen Aufgaben im Kanban-Board
          </p>
        </div>

        {/* Coming Soon Card */}
        <Card className="border-2 border-dashed">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 inline-flex rounded-full bg-gradient-to-r from-[var(--color-fanini-blue)] to-[var(--color-fanini-red)] p-4">
              <ListTodo className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl">Kanban-Board entsteht...</CardTitle>
            <CardDescription className="mx-auto mt-2 max-w-2xl">
              Ein interaktives Kanban-Board für deine Aufgaben mit Drag & Drop Funktionalität.
              Aufgaben können zwischen "Offen", "In Arbeit", "Review" und "Fertig" verschoben
              werden.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              <div className="text-center">
                <Clock className="mx-auto mb-2 h-8 w-8 text-orange-500" />
                <p className="font-semibold">Offen</p>
                <p className="text-muted-foreground text-sm">Neue Aufgaben</p>
              </div>
              <div className="text-center">
                <AlertCircle className="mx-auto mb-2 h-8 w-8 text-blue-500" />
                <p className="font-semibold">In Arbeit</p>
                <p className="text-muted-foreground text-sm">Aktuelle Tasks</p>
              </div>
              <div className="text-center">
                <ListTodo className="mx-auto mb-2 h-8 w-8 text-purple-500" />
                <p className="font-semibold">Review</p>
                <p className="text-muted-foreground text-sm">Zur Prüfung</p>
              </div>
              <div className="text-center">
                <CheckCircle2 className="mx-auto mb-2 h-8 w-8 text-green-500" />
                <p className="font-semibold">Fertig</p>
                <p className="text-muted-foreground text-sm">Abgeschlossen</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Features Preview */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Filter & Sortierung</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">
                Nach Event, Team, Priorität und Frist filtern
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">
                Aufgaben direkt aus der Übersicht bearbeiten
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Kommentare</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">Diskussionen direkt an Aufgaben</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </Container>
  );
}

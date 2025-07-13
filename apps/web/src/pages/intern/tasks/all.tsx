// apps/web/src/pages/intern/tasks/all.tsx
import { createFileRoute } from '@tanstack/react-router';
import { BarChart3, Shield,Users } from 'lucide-react';

import { Badge } from '@/shared/shadcn/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/shadcn/card';
import { Container } from '@/shared/ui';

export const Route = createFileRoute('/intern/tasks/all')({
  component: AllTasksPage,
});

function AllTasksPage() {
  return (
    <Container className="py-8">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-[var(--color-fanini-blue)]">Alle Aufgaben</h1>
          <p className="text-muted-foreground mt-2">
            Team-Übersicht und Aufgabenverteilung (nur für Team-Leiter, Beirat & Vorstand)
          </p>
        </div>

        {/* Access Control Notice */}
        <Card className="border-amber-200 bg-amber-50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-amber-600" />
              <CardTitle className="text-lg">Zugriffsbeschränkter Bereich</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              Diese Seite ist nur für Team-Leiter, Beirat und Vorstand sichtbar. Hier können
              Aufgaben teamübergreifend verwaltet und zugewiesen werden.
            </p>
          </CardContent>
        </Card>

        {/* Coming Soon Card */}
        <Card className="border-2 border-dashed">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 inline-flex rounded-full bg-gradient-to-r from-[var(--color-fanini-blue)] to-[var(--color-fanini-red)] p-4">
              <Users className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl">Team-Aufgabenübersicht entsteht...</CardTitle>
            <CardDescription className="mx-auto mt-2 max-w-2xl">
              Verwalte alle Aufgaben deines Teams oder des gesamten Vereins. Weise Aufgaben zu,
              überwache den Fortschritt und analysiere die Auslastung.
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Features Preview */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <BarChart3 className="h-5 w-5 text-[var(--color-fanini-blue)]" />
                Workload-Analyse
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-muted-foreground text-sm">
                Übersicht über die Aufgabenverteilung im Team
              </p>
              <div className="space-y-2">
                <Badge variant="outline">Auslastung pro Mitglied</Badge>
                <Badge variant="outline">Überfällige Aufgaben</Badge>
                <Badge variant="outline">Aufgaben nach Priorität</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Users className="h-5 w-5 text-[var(--color-fanini-blue)]" />
                Bulk-Aktionen
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-muted-foreground text-sm">
                Mehrere Aufgaben gleichzeitig bearbeiten
              </p>
              <div className="space-y-2">
                <Badge variant="outline">Massenzuweisung</Badge>
                <Badge variant="outline">Status-Updates</Badge>
                <Badge variant="outline">Prioritäten ändern</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Container>
  );
}

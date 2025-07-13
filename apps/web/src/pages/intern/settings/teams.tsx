// src/pages/intern/settings/teams.tsx
import { createFileRoute } from '@tanstack/react-router';
import { Settings as SettingsIcon,Shield, UserPlus, Users } from 'lucide-react';

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

export const Route = createFileRoute('/intern/settings/teams')({
  component: TeamSettingsPage,
});

function TeamSettingsPage() {
  return (
    <Container className="py-8">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-[var(--color-fanini-blue)]">Team-Einstellungen</h1>
          <p className="text-muted-foreground mt-2">Verwalte dein Team und dessen Einstellungen</p>
        </div>

        {/* Access Notice */}
        <Card className="border-amber-200 bg-amber-50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-amber-600" />
              <CardTitle className="text-lg">Team-Leiter Bereich</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              Diese Seite ist nur für Team-Leiter sichtbar. Hier kannst du dein Team verwalten,
              Mitglieder hinzufügen oder entfernen und team-spezifische Einstellungen vornehmen.
            </p>
          </CardContent>
        </Card>

        {/* Coming Soon Card */}
        <Card className="border-2 border-dashed">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 inline-flex rounded-full bg-gradient-to-r from-[var(--color-fanini-blue)] to-[var(--color-fanini-red)] p-4">
              <Users className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl">Team-Verwaltung entsteht...</CardTitle>
            <CardDescription className="mx-auto mt-2 max-w-2xl">
              Umfassende Tools zur Verwaltung deines Teams und seiner Aktivitäten.
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Features Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserPlus className="h-5 w-5 text-[var(--color-fanini-blue)]" />
                Mitgliederverwaltung
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4 text-sm">
                Verwalte die Mitglieder deines Teams
              </p>
              <div className="space-y-3">
                <div className="rounded-lg border p-3">
                  <p className="text-sm font-medium">Mitglieder hinzufügen</p>
                  <p className="text-muted-foreground mt-1 text-xs">
                    Lade neue Mitglieder in dein Team ein
                  </p>
                </div>
                <div className="rounded-lg border p-3">
                  <p className="text-sm font-medium">Rollen verwalten</p>
                  <p className="text-muted-foreground mt-1 text-xs">
                    Definiere Rollen und Verantwortlichkeiten
                  </p>
                </div>
                <div className="rounded-lg border p-3">
                  <p className="text-sm font-medium">Aktivitäten</p>
                  <p className="text-muted-foreground mt-1 text-xs">
                    Übersicht über Team-Aktivitäten
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <SettingsIcon className="h-5 w-5 text-[var(--color-fanini-blue)]" />
                Team-Konfiguration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4 text-sm">
                Passe die Einstellungen deines Teams an
              </p>
              <div className="space-y-2">
                <Badge variant="outline" className="mr-2">
                  Team-Beschreibung
                </Badge>
                <Badge variant="outline" className="mr-2">
                  Sichtbarkeit
                </Badge>
                <Badge variant="outline" className="mr-2">
                  Benachrichtigungen
                </Badge>
                <Badge variant="outline" className="mr-2">
                  Berechtigungen
                </Badge>
                <Badge variant="outline" className="mr-2">
                  Workflows
                </Badge>
                <Badge variant="outline" className="mr-2">
                  Integrationen
                </Badge>
              </div>
              <p className="text-muted-foreground mt-3 text-xs">
                Alle Änderungen werden protokolliert
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Team Stats Preview */}
        <Card>
          <CardHeader>
            <CardTitle>Team-Statistiken (Vorschau)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 text-center md:grid-cols-4">
              <div>
                <p className="text-2xl font-bold text-[var(--color-fanini-blue)]">12</p>
                <p className="text-muted-foreground text-sm">Mitglieder</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-purple-600">8</p>
                <p className="text-muted-foreground text-sm">Aktive Projekte</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">24</p>
                <p className="text-muted-foreground text-sm">Erledigte Aufgaben</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-amber-600">3</p>
                <p className="text-muted-foreground text-sm">Anstehende Events</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Container>
  );
}

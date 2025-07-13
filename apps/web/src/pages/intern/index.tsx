// src/pages/intern/index.tsx
import { createFileRoute, Link } from '@tanstack/react-router';
import {
  Activity,
  Calendar,
  CheckCircle2,
  Clock,
  LayoutDashboard,
  TrendingUp,
  Users,
  Zap,
} from 'lucide-react';

import { Badge } from '@/shared/shadcn/badge';
import { Button } from '@/shared/shadcn/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/shadcn/card';
import { Container } from '@/shared/ui';

export const Route = createFileRoute('/intern/')({
  component: DashboardPage,
});

function DashboardPage() {
  // Mock user data from localStorage
  const authData = localStorage.getItem('fanini-auth');
  const user = authData ? JSON.parse(authData).user : null;

  return (
    <Container className="py-8">
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="rounded-xl bg-gradient-to-r from-[var(--color-fanini-blue)] to-[var(--color-fanini-red)] p-8 text-white">
          <h1 className="mb-2 text-3xl font-bold">
            Willkommen zurück, {user?.name || 'Mitglied'}!
          </h1>
          <p className="opacity-90">
            Hier ist deine persönliche Übersicht mit allen wichtigen Informationen.
          </p>
        </div>

        {/* Coming Soon Card */}
        <Card className="border-2 border-dashed">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 inline-flex rounded-full bg-gradient-to-r from-[var(--color-fanini-blue)] to-[var(--color-fanini-red)] p-4">
              <LayoutDashboard className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl">Persönliches Dashboard entsteht...</CardTitle>
            <CardDescription className="mx-auto mt-2 max-w-2xl">
              Ein anpassbares Dashboard mit verschiebbaren Widgets für deine persönliche Übersicht.
              Behalte Aufgaben, Events und Team-Updates im Blick.
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Preview Widgets */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {/* Stats Cards */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-muted-foreground text-sm font-medium">
                Offene Aufgaben
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[var(--color-fanini-blue)]">5</div>
              <p className="text-muted-foreground mt-1 flex items-center gap-1 text-xs">
                <Clock className="h-3 w-3" />2 diese Woche fällig
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-muted-foreground text-sm font-medium">
                Nächstes Event
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">3</div>
              <p className="text-muted-foreground text-xs">Tage</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-muted-foreground text-sm font-medium">
                Team-Aktivität
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">12</div>
              <p className="text-muted-foreground mt-1 flex items-center gap-1 text-xs">
                <TrendingUp className="h-3 w-3" />
                Updates heute
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-muted-foreground text-sm font-medium">
                Vereinsmitglieder
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-600">156</div>
              <p className="text-muted-foreground text-xs">+3 diesen Monat</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Widgets */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Tasks Widget */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-[var(--color-fanini-blue)]" />
                  Meine Aufgaben
                </span>
                <Button size="sm" variant="ghost" asChild>
                  <Link to="/intern/tasks">Alle anzeigen</Link>
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="bg-muted/50 flex items-start gap-3 rounded-lg p-3">
                  <CheckCircle2 className="text-muted-foreground mt-0.5 h-4 w-4" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Getränke für Event bestellen</p>
                    <p className="text-muted-foreground text-xs">Fällig in 2 Tagen</p>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    Event
                  </Badge>
                </div>
                <div className="bg-muted/50 flex items-start gap-3 rounded-lg p-3">
                  <CheckCircle2 className="text-muted-foreground mt-0.5 h-4 w-4" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Newsletter-Entwurf reviewen</p>
                    <p className="text-muted-foreground text-xs">Fällig heute</p>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    Medien
                  </Badge>
                </div>
                <div className="bg-muted/50 flex items-start gap-3 rounded-lg p-3">
                  <CheckCircle2 className="text-muted-foreground mt-0.5 h-4 w-4" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Teilnehmerliste aktualisieren</p>
                    <p className="text-muted-foreground text-xs">Fällig morgen</p>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    Verein
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Calendar Widget */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-[var(--color-fanini-blue)]" />
                  Kommende Events
                </span>
                <Button size="sm" variant="ghost" asChild>
                  <Link to="/intern/events">Alle Events</Link>
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="bg-muted/50 flex items-center gap-3 rounded-lg p-3">
                  <div className="text-center">
                    <p className="text-muted-foreground text-xs">Jan</p>
                    <p className="text-lg font-bold">28</p>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Rückrundenstart-Party</p>
                    <p className="text-muted-foreground text-xs">19:00 Uhr - Vereinsheim</p>
                  </div>
                  <Badge className="border-0 bg-purple-100 text-purple-700">Party</Badge>
                </div>
                <div className="bg-muted/50 flex items-center gap-3 rounded-lg p-3">
                  <div className="text-center">
                    <p className="text-muted-foreground text-xs">Feb</p>
                    <p className="text-lg font-bold">14</p>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Auswärtsfahrt Berlin</p>
                    <p className="text-muted-foreground text-xs">14:00 Uhr - Busabfahrt</p>
                  </div>
                  <Badge className="border-0 bg-[var(--color-fanini-red)]/20 text-[var(--color-fanini-red)]">
                    Auswärts
                  </Badge>
                </div>
                <div className="bg-muted/50 flex items-center gap-3 rounded-lg p-3">
                  <div className="text-center">
                    <p className="text-muted-foreground text-xs">Mär</p>
                    <p className="text-lg font-bold">01</p>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Mitgliederversammlung</p>
                    <p className="text-muted-foreground text-xs">18:30 Uhr - Vereinsheim</p>
                  </div>
                  <Badge className="border-0 bg-blue-100 text-blue-700">Meeting</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Activity Feed */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-[var(--color-fanini-blue)]" />
              Team-Updates
            </CardTitle>
            <CardDescription>Neueste Aktivitäten aus deinen Teams</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100">
                  <Users className="h-4 w-4 text-purple-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm">
                    <span className="font-medium">Sarah Schmidt</span> hat dich zu{' '}
                    <span className="font-medium">Team Event</span> hinzugefügt
                  </p>
                  <p className="text-muted-foreground text-xs">vor 2 Stunden</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm">
                    <span className="font-medium">Tom Krause</span> hat die Aufgabe{' '}
                    <span className="font-medium">"Location buchen"</span> abgeschlossen
                  </p>
                  <p className="text-muted-foreground text-xs">vor 4 Stunden</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100">
                  <Zap className="h-4 w-4 text-amber-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm">
                    Neues Event <span className="font-medium">"Sommerfest 2024"</span> wurde
                    erstellt
                  </p>
                  <p className="text-muted-foreground text-xs">gestern</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Widget Customization Info */}
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-lg">Dashboard-Anpassung (Coming Soon)</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">In Zukunft kannst du dein Dashboard individuell anpassen:</p>
            <ul className="mt-2 space-y-1 text-sm">
              <li>• Widgets per Drag & Drop verschieben</li>
              <li>• Neue Widgets hinzufügen oder entfernen</li>
              <li>• Größe der Widgets anpassen</li>
              <li>• Persönliche Statistiken und Ziele setzen</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </Container>
  );
}

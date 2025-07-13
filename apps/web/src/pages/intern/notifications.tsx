// src/pages/intern/notifications.tsx
import { createFileRoute } from '@tanstack/react-router';
import { Bell, BellOff, Check, CheckCheck, Filter, Settings } from 'lucide-react';

import { Badge } from '@/shared/shadcn/badge';
import { Button } from '@/shared/shadcn/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/shadcn/card';
import { Container } from '@/shared/ui';

export const Route = createFileRoute('/intern/notifications')({
  component: NotificationsPage,
});

function NotificationsPage() {
  return (
    <Container className="py-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[var(--color-fanini-blue)]">
              Benachrichtigungen
            </h1>
            <p className="text-muted-foreground mt-2">Alle Updates und Mitteilungen an einem Ort</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
            <Button variant="outline">
              <CheckCheck className="mr-2 h-4 w-4" />
              Alle als gelesen
            </Button>
            <Button variant="outline">
              <Settings className="mr-2 h-4 w-4" />
              Einstellungen
            </Button>
          </div>
        </div>

        {/* Coming Soon Card */}
        <Card className="border-2 border-dashed">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 inline-flex rounded-full bg-gradient-to-r from-[var(--color-fanini-blue)] to-[var(--color-fanini-red)] p-4">
              <Bell className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl">Benachrichtigungssystem entsteht...</CardTitle>
            <CardDescription className="mx-auto mt-2 max-w-2xl">
              Ein intelligentes Benachrichtigungssystem, das dich über alle wichtigen Ereignisse im
              Verein informiert.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              <div className="text-center">
                <div className="mx-auto mb-2 inline-flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                  <Bell className="h-6 w-6 text-blue-600" />
                </div>
                <p className="text-sm font-medium">System</p>
                <p className="text-muted-foreground text-xs">Updates & Infos</p>
              </div>
              <div className="text-center">
                <div className="mx-auto mb-2 inline-flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
                  <Bell className="h-6 w-6 text-purple-600" />
                </div>
                <p className="text-sm font-medium">Events</p>
                <p className="text-muted-foreground text-xs">Anmeldungen & Änderungen</p>
              </div>
              <div className="text-center">
                <div className="mx-auto mb-2 inline-flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                  <Bell className="h-6 w-6 text-green-600" />
                </div>
                <p className="text-sm font-medium">Aufgaben</p>
                <p className="text-muted-foreground text-xs">Zuweisungen & Deadlines</p>
              </div>
              <div className="text-center">
                <div className="mx-auto mb-2 inline-flex h-12 w-12 items-center justify-center rounded-full bg-amber-100">
                  <Bell className="h-6 w-6 text-amber-600" />
                </div>
                <p className="text-sm font-medium">Erwähnungen</p>
                <p className="text-muted-foreground text-xs">@Mentions & Replies</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notification Features */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-[var(--color-fanini-blue)]" />
                Benachrichtigungstypen
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Event-Updates</p>
                    <p className="text-muted-foreground text-xs">
                      Neue Events, Änderungen, Absagen
                    </p>
                  </div>
                  <Badge variant="secondary">Aktiv</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Aufgaben-Benachrichtigungen</p>
                    <p className="text-muted-foreground text-xs">Neue Zuweisungen, Fristen</p>
                  </div>
                  <Badge variant="secondary">Aktiv</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Team-Updates</p>
                    <p className="text-muted-foreground text-xs">Neuigkeiten aus deinen Teams</p>
                  </div>
                  <Badge variant="secondary">Aktiv</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Kommentare & Erwähnungen</p>
                    <p className="text-muted-foreground text-xs">Antworten und @Mentions</p>
                  </div>
                  <Badge variant="secondary">Aktiv</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-[var(--color-fanini-blue)]" />
                Einstellungsoptionen
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="rounded-lg border p-3">
                  <p className="mb-1 text-sm font-medium">Kanäle</p>
                  <div className="mt-2 flex gap-2">
                    <Badge variant="outline">In-App</Badge>
                    <Badge variant="outline">E-Mail</Badge>
                    <Badge variant="outline">Push</Badge>
                  </div>
                </div>
                <div className="rounded-lg border p-3">
                  <p className="mb-1 text-sm font-medium">Zeitsteuerung</p>
                  <p className="text-muted-foreground text-xs">
                    Ruhezeiten und Zusammenfassungen konfigurieren
                  </p>
                </div>
                <div className="rounded-lg border p-3">
                  <p className="mb-1 text-sm font-medium">Prioritäten</p>
                  <p className="text-muted-foreground text-xs">
                    Wichtige Benachrichtigungen priorisieren
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Mock Notifications Preview */}
        <Card>
          <CardHeader>
            <CardTitle>Beispiel-Benachrichtigungen</CardTitle>
            <CardDescription>So werden deine Benachrichtigungen aussehen</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="hover:bg-muted/50 flex items-start gap-3 rounded-lg p-3 transition-colors">
              <div className="mt-0.5 h-2 w-2 rounded-full bg-[var(--color-fanini-blue)]" />
              <div className="flex-1">
                <p className="text-sm font-medium">Neue Event-Anmeldung</p>
                <p className="text-muted-foreground text-xs">
                  5 neue Anmeldungen für "Rückrundenstart-Party"
                </p>
                <p className="text-muted-foreground mt-1 text-xs">vor 5 Minuten</p>
              </div>
              <Button size="sm" variant="ghost">
                <Check className="h-4 w-4" />
              </Button>
            </div>
            <div className="hover:bg-muted/50 flex items-start gap-3 rounded-lg p-3 transition-colors">
              <div className="mt-0.5 h-2 w-2 rounded-full bg-purple-500" />
              <div className="flex-1">
                <p className="text-sm font-medium">Aufgabe zugewiesen</p>
                <p className="text-muted-foreground text-xs">
                  Tom hat dir die Aufgabe "Getränke organisieren" zugewiesen
                </p>
                <p className="text-muted-foreground mt-1 text-xs">vor 1 Stunde</p>
              </div>
              <Button size="sm" variant="ghost">
                <Check className="h-4 w-4" />
              </Button>
            </div>
            <div className="hover:bg-muted/50 flex items-start gap-3 rounded-lg p-3 opacity-60 transition-colors">
              <div className="mt-0.5">
                <BellOff className="text-muted-foreground h-4 w-4" />
              </div>
              <div className="flex-1">
                <p className="text-muted-foreground text-sm font-medium">System-Update</p>
                <p className="text-muted-foreground text-xs">Neue Features wurden hinzugefügt</p>
                <p className="text-muted-foreground mt-1 text-xs">vor 2 Tagen</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Container>
  );
}

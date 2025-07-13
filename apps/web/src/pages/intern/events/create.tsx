// src/pages/intern/events/create.tsx
import { createFileRoute } from '@tanstack/react-router';
import { ArrowRight, Calendar, FileText, MapPin, Users } from 'lucide-react';

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

export const Route = createFileRoute('/intern/events/create')({
  component: CreateEventPage,
});

function CreateEventPage() {
  return (
    <Container className="py-8">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-[var(--color-fanini-blue)]">Event erstellen</h1>
          <p className="text-muted-foreground mt-2">Plane eine neue Veranstaltung für den Verein</p>
        </div>

        {/* Coming Soon Card */}
        <Card className="border-2 border-dashed">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 inline-flex rounded-full bg-gradient-to-r from-[var(--color-fanini-blue)] to-[var(--color-fanini-red)] p-4">
              <Calendar className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl">Event-Erstellung entsteht...</CardTitle>
            <CardDescription className="mx-auto mt-2 max-w-2xl">
              Ein mehrstufiger Wizard zur einfachen Erstellung von Events mit allen wichtigen
              Details.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Multi-Step Preview */}
            <div className="mb-8 flex items-center justify-center gap-2">
              <div className="text-center">
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-fanini-blue)] text-white">
                  1
                </div>
                <p className="text-xs">Basis-Infos</p>
              </div>
              <ArrowRight className="text-muted-foreground h-4 w-4" />
              <div className="text-center">
                <div className="bg-muted text-muted-foreground mb-2 flex h-10 w-10 items-center justify-center rounded-full">
                  2
                </div>
                <p className="text-xs">Ort & Zeit</p>
              </div>
              <ArrowRight className="text-muted-foreground h-4 w-4" />
              <div className="text-center">
                <div className="bg-muted text-muted-foreground mb-2 flex h-10 w-10 items-center justify-center rounded-full">
                  3
                </div>
                <p className="text-xs">Budget</p>
              </div>
              <ArrowRight className="text-muted-foreground h-4 w-4" />
              <div className="text-center">
                <div className="bg-muted text-muted-foreground mb-2 flex h-10 w-10 items-center justify-center rounded-full">
                  4
                </div>
                <p className="text-xs">Aufgaben</p>
              </div>
            </div>

            {/* Form Fields Preview */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-3">
                <h4 className="flex items-center gap-2 font-medium">
                  <FileText className="h-4 w-4 text-[var(--color-fanini-blue)]" />
                  Basis-Informationen
                </h4>
                <ul className="text-muted-foreground space-y-2 text-sm">
                  <li>• Event-Titel</li>
                  <li>• Beschreibung</li>
                  <li>• Event-Typ (Party, Auswärtsfahrt, etc.)</li>
                  <li>• Öffentlich/Intern</li>
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="flex items-center gap-2 font-medium">
                  <MapPin className="h-4 w-4 text-[var(--color-fanini-blue)]" />
                  Details
                </h4>
                <ul className="text-muted-foreground space-y-2 text-sm">
                  <li>• Veranstaltungsort</li>
                  <li>• Datum & Uhrzeit</li>
                  <li>• Maximale Teilnehmerzahl</li>
                  <li>• Anmeldeschluss</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Container>
  );
}

// src/pages/intern/club/newsletter.tsx
import { createFileRoute } from '@tanstack/react-router';
import { Clock, Edit3, Mail, Send } from 'lucide-react';

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

export const Route = createFileRoute('/intern/club/newsletter')({
  component: NewsletterManagement,
});

function NewsletterManagement() {
  return (
    <Container className="py-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[var(--color-fanini-blue)]">
              Newsletter-Verwaltung
            </h1>
            <p className="text-muted-foreground mt-2">
              Erstelle und versende Newsletter an Mitglieder und Abonnenten
            </p>
          </div>
          <Button className="bg-gradient-to-r from-[var(--color-fanini-blue)] to-[var(--color-fanini-red)]">
            <Edit3 className="mr-2 h-4 w-4" />
            Neuer Newsletter
          </Button>
        </div>

        {/* Coming Soon Card */}
        <Card className="border-2 border-dashed">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 inline-flex rounded-full bg-gradient-to-r from-[var(--color-fanini-blue)] to-[var(--color-fanini-red)] p-4">
              <Mail className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl">Newsletter-System entsteht...</CardTitle>
            <CardDescription className="mx-auto mt-2 max-w-2xl">
              Ein professionelles Newsletter-System mit Vorlagen, Zeitplanung und Analysen.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader>
                  <Edit3 className="mb-2 h-8 w-8 text-[var(--color-fanini-blue)]" />
                  <CardTitle className="text-lg">Editor</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">
                    Rich-Text Editor mit Vorlagen und Bausteinen
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <Clock className="mb-2 h-8 w-8 text-[var(--color-fanini-blue)]" />
                  <CardTitle className="text-lg">Zeitplanung</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">
                    Newsletter im Voraus planen und automatisch versenden
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <Send className="mb-2 h-8 w-8 text-[var(--color-fanini-blue)]" />
                  <CardTitle className="text-lg">Versand</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">
                    Segmentierung und personalisierter Versand
                  </p>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        {/* Features */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Newsletter-Archiv</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-muted-foreground mb-3 text-sm">
                Alle versendeten Newsletter im Überblick
              </p>
              <Badge variant="outline" className="mr-2">
                Suchfunktion
              </Badge>
              <Badge variant="outline" className="mr-2">
                Kategorien
              </Badge>
              <Badge variant="outline" className="mr-2">
                Statistiken
              </Badge>
              <Badge variant="outline" className="mr-2">
                Re-Send Option
              </Badge>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Empfänger-Management</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-muted-foreground mb-3 text-sm">
                Verwalte Abonnenten und Empfängergruppen
              </p>
              <Badge variant="outline" className="mr-2">
                Import/Export
              </Badge>
              <Badge variant="outline" className="mr-2">
                Segmentierung
              </Badge>
              <Badge variant="outline" className="mr-2">
                Bounces
              </Badge>
              <Badge variant="outline" className="mr-2">
                Abmeldungen
              </Badge>
            </CardContent>
          </Card>
        </div>
      </div>
    </Container>
  );
}

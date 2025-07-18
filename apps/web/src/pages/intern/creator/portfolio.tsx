// src/pages/intern/creator/portfolio.tsx
import { createFileRoute, Link } from '@tanstack/react-router';
import { Grid3x3, ImagePlus, Link2, Save } from 'lucide-react';

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

export const Route = createFileRoute('/intern/creator/portfolio')({
  component: PortfolioManagement,
});

function PortfolioManagement() {
  return (
    <Container className="py-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[var(--color-fanini-blue)]">
              Portfolio verwalten
            </h1>
            <p className="text-muted-foreground mt-2">
              Bearbeite dein Künstlerprofil und deine Werke
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Save className="mr-2 h-4 w-4" />
              Speichern
            </Button>
            <Button className="bg-gradient-to-r from-purple-500 to-amber-500">
              <ImagePlus className="mr-2 h-4 w-4" />
              Werk hinzufügen
            </Button>
          </div>
        </div>

        {/* Coming Soon Card */}
        <Card className="border-2 border-dashed">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 inline-flex rounded-full bg-gradient-to-r from-purple-500 to-amber-500 p-4">
              <Grid3x3 className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl">Portfolio-Verwaltung entsteht...</CardTitle>
            <CardDescription className="mx-auto mt-2 max-w-2xl">
              Ein intuitives Interface zur Verwaltung deiner kreativen Werke. Mit Drag & Drop
              Sortierung und detaillierten Einstellungen.
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Feature Sections */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImagePlus className="h-5 w-5 text-purple-500" />
                Werk-Verwaltung
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4 text-sm">
                Verwalte deine kreativen Arbeiten
              </p>
              <div className="space-y-3">
                <div className="rounded-lg border p-3">
                  <p className="text-sm font-medium">Upload-Optionen</p>
                  <div className="mt-2 flex gap-2">
                    <Badge variant="outline">Bilder</Badge>
                    <Badge variant="outline">Videos</Badge>
                    <Badge variant="outline">Audio</Badge>
                    <Badge variant="outline">Text</Badge>
                  </div>
                </div>
                <div className="rounded-lg border p-3">
                  <p className="text-sm font-medium">Metadaten</p>
                  <p className="text-muted-foreground mt-1 text-xs">
                    Titel, Beschreibung, Tags, Erstellungsdatum
                  </p>
                </div>
                <div className="rounded-lg border p-3">
                  <p className="text-sm font-medium">Sortierung</p>
                  <p className="text-muted-foreground mt-1 text-xs">
                    Drag & Drop für individuelle Reihenfolge
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Link2 className="h-5 w-5 text-amber-500" />
                Profil-Einstellungen
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4 text-sm">
                Personalisiere dein Künstlerprofil
              </p>
              <div className="space-y-3">
                <div className="rounded-lg border p-3">
                  <p className="text-sm font-medium">Künstlername</p>
                  <p className="text-muted-foreground mt-1 text-xs">
                    Dein öffentlicher Name als Creator
                  </p>
                </div>
                <div className="rounded-lg border p-3">
                  <p className="text-sm font-medium">Profiltext</p>
                  <p className="text-muted-foreground mt-1 text-xs">
                    Beschreibe dich und deine Kunst
                  </p>
                </div>
                <div className="rounded-lg border p-3">
                  <p className="text-sm font-medium">Social Media</p>
                  <div className="mt-2 flex gap-2">
                    <Badge variant="secondary">Instagram</Badge>
                    <Badge variant="secondary">Twitter</Badge>
                    <Badge variant="secondary">Website</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Back Button */}
        <div className="flex justify-center">
          <Button variant="outline" size="lg" asChild>
            <Link to="/intern/creator">Zurück zum Dashboard</Link>
          </Button>
        </div>
      </div>
    </Container>
  );
}

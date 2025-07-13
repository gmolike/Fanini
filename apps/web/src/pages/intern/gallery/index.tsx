// src/pages/intern/gallery/index.tsx
import { createFileRoute, Link } from '@tanstack/react-router';
import { Camera, Download, Filter, Grid3x3, Upload } from 'lucide-react';

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

export const Route = createFileRoute('/intern/gallery/')({
  component: GalleryPage,
});

function GalleryPage() {
  return (
    <Container className="py-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[var(--color-fanini-blue)]">Mediengalerie</h1>
            <p className="text-muted-foreground mt-2">
              Zentrale Sammlung aller Vereinsfotos und Videos
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
            <Button
              asChild
              className="bg-gradient-to-r from-[var(--color-fanini-blue)] to-[var(--color-fanini-red)]"
            >
              <Link to="/intern/gallery/upload">
                <Upload className="mr-2 h-4 w-4" />
                Upload
              </Link>
            </Button>
          </div>
        </div>

        {/* Coming Soon Card */}
        <Card className="border-2 border-dashed">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 inline-flex rounded-full bg-gradient-to-r from-[var(--color-fanini-blue)] to-[var(--color-fanini-red)] p-4">
              <Grid3x3 className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl">Mediengalerie entsteht...</CardTitle>
            <CardDescription className="mx-auto mt-2 max-w-2xl">
              Eine übersichtliche Galerie mit allen Fotos und Videos des Vereins. Mit Google Drive
              Integration für nahtlosen Zugriff auf alle Medien.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-3">
              <Card>
                <CardHeader>
                  <Camera className="mb-2 h-8 w-8 text-[var(--color-fanini-blue)]" />
                  <CardTitle className="text-lg">Grid-Ansicht</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">
                    Übersichtliche Darstellung mit Vorschaubildern
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <Filter className="mb-2 h-8 w-8 text-[var(--color-fanini-blue)]" />
                  <CardTitle className="text-lg">Smart Filter</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">
                    Nach Event, Datum, Typ und Tags filtern
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <Download className="mb-2 h-8 w-8 text-[var(--color-fanini-blue)]" />
                  <CardTitle className="text-lg">Batch-Download</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">
                    Mehrere Dateien gleichzeitig herunterladen
                  </p>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        {/* Features Preview */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Geplante Features</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Badge variant="outline" className="mr-2">
                Automatische Bildoptimierung
              </Badge>
              <Badge variant="outline" className="mr-2">
                Rechteverwaltung
              </Badge>
              <Badge variant="outline" className="mr-2">
                Wasserzeichen-Option
              </Badge>
              <Badge variant="outline" className="mr-2">
                Album-Erstellung
              </Badge>
              <Badge variant="outline" className="mr-2">
                Social Media Export
              </Badge>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Google Drive Integration</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-3 text-sm">
                Nahtlose Integration mit Google Drive für unbegrenzten Speicherplatz
              </p>
              <div className="space-y-1 text-sm">
                <div>✓ Automatische Synchronisation</div>
                <div>✓ Ordnerstruktur nach Events</div>
                <div>✓ Versionskontrolle</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Container>
  );
}

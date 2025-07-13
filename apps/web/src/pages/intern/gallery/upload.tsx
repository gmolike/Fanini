// src/pages/intern/gallery/upload.tsx
import { createFileRoute, Link } from '@tanstack/react-router';
import { Cloud, FileImage, Upload, X } from 'lucide-react';

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

export const Route = createFileRoute('/intern/gallery/upload')({
  component: UploadPage,
});

function UploadPage() {
  return (
    <Container className="py-8">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-[var(--color-fanini-blue)]">Medien hochladen</h1>
          <p className="text-muted-foreground mt-2">
            Lade Fotos und Videos für die Vereinsgalerie hoch
          </p>
        </div>

        {/* Coming Soon Card */}
        <Card className="border-2 border-dashed">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 inline-flex rounded-full bg-gradient-to-r from-[var(--color-fanini-blue)] to-[var(--color-fanini-red)] p-4">
              <Cloud className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl">Upload-Bereich entsteht...</CardTitle>
            <CardDescription className="mx-auto mt-2 max-w-2xl">
              Ein moderner Upload-Bereich mit Drag & Drop, automatischer Optimierung und direkter
              Google Drive Integration.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Drag & Drop Preview */}
            <div className="mb-6 rounded-lg border-2 border-dashed p-8 text-center transition-colors hover:border-[var(--color-fanini-blue)]">
              <Upload className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
              <p className="mb-2 text-lg font-medium">Dateien hier ablegen</p>
              <p className="text-muted-foreground mb-4 text-sm">oder klicken zum Auswählen</p>
              <div className="flex justify-center gap-2">
                <Badge variant="secondary">JPG</Badge>
                <Badge variant="secondary">PNG</Badge>
                <Badge variant="secondary">MP4</Badge>
                <Badge variant="secondary">MOV</Badge>
              </div>
            </div>

            {/* Features */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-3">
                <h3 className="flex items-center gap-2 font-semibold">
                  <FileImage className="h-5 w-5 text-[var(--color-fanini-blue)]" />
                  Upload-Features
                </h3>
                <ul className="text-muted-foreground space-y-2 text-sm">
                  <li>• Batch-Upload mehrerer Dateien</li>
                  <li>• Automatische Bildoptimierung</li>
                  <li>• Metadaten-Extraktion</li>
                  <li>• Fortschrittsanzeige</li>
                </ul>
              </div>
              <div className="space-y-3">
                <h3 className="flex items-center gap-2 font-semibold">
                  <Cloud className="h-5 w-5 text-[var(--color-fanini-blue)]" />
                  Metadaten
                </h3>
                <ul className="text-muted-foreground space-y-2 text-sm">
                  <li>• Event-Zuordnung</li>
                  <li>• Tags und Kategorien</li>
                  <li>• Verwendungsrechte</li>
                  <li>• Beschreibungen</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Back Button */}
        <div className="flex justify-center">
          <Button variant="outline" size="lg" asChild>
            <Link to="/intern/gallery">
              <X className="mr-2 h-4 w-4" />
              Zurück zur Galerie
            </Link>
          </Button>
        </div>
      </div>
    </Container>
  );
}

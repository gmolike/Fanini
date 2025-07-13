// src/pages/intern/club/documents.tsx
import { createFileRoute } from '@tanstack/react-router';
import { Download, FileText, Plus, Shield } from 'lucide-react';

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

export const Route = createFileRoute('/intern/club/documents')({
  component: DocumentsManagement,
});

function DocumentsManagement() {
  return (
    <Container className="py-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[var(--color-fanini-blue)]">
              Dokumente verwalten
            </h1>
            <p className="text-muted-foreground mt-2">Offizielle Vereinsdokumente und Vorlagen</p>
          </div>
          <Button className="bg-gradient-to-r from-[var(--color-fanini-blue)] to-[var(--color-fanini-red)]">
            <Plus className="mr-2 h-4 w-4" />
            Dokument hinzufügen
          </Button>
        </div>

        {/* Access Notice */}
        <Card className="border-amber-200 bg-amber-50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-amber-600" />
              <CardTitle className="text-lg">Bearbeitungsrechte</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              Die Bearbeitung von offiziellen Dokumenten ist dem Vorstand vorbehalten. Andere Rollen
              können Dokumente einsehen und herunterladen.
            </p>
          </CardContent>
        </Card>

        {/* Coming Soon Card */}
        <Card className="border-2 border-dashed">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 inline-flex rounded-full bg-gradient-to-r from-[var(--color-fanini-blue)] to-[var(--color-fanini-red)] p-4">
              <FileText className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl">Dokumentenverwaltung entsteht...</CardTitle>
            <CardDescription className="mx-auto mt-2 max-w-2xl">
              Zentrale Verwaltung aller Vereinsdokumente mit Versionierung und Rechteverwaltung.
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Document Categories */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Offizielle Dokumente</CardTitle>
              <CardDescription>Rechtlich bindende Vereinsdokumente</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between rounded border p-2">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-[var(--color-fanini-blue)]" />
                    <span className="text-sm font-medium">Satzung</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">v2.1</Badge>
                    <Button size="sm" variant="ghost">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex items-center justify-between rounded border p-2">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-[var(--color-fanini-blue)]" />
                    <span className="text-sm font-medium">Geschäftsordnung</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">v1.3</Badge>
                    <Button size="sm" variant="ghost">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Vorlagen</CardTitle>
              <CardDescription>Wiederverwendbare Dokumentvorlagen</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Badge variant="outline" className="mr-2">
                  E-Mail-Vorlagen
                </Badge>
                <Badge variant="outline" className="mr-2">
                  Protokoll-Vorlagen
                </Badge>
                <Badge variant="outline" className="mr-2">
                  Anträge
                </Badge>
                <Badge variant="outline" className="mr-2">
                  Mitgliedsausweise
                </Badge>
                <Badge variant="outline" className="mr-2">
                  Einladungen
                </Badge>
                <Badge variant="outline" className="mr-2">
                  Berichte
                </Badge>
              </div>
              <p className="text-muted-foreground mt-3 text-sm">12 Vorlagen verfügbar</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </Container>
  );
}

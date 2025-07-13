// src/pages/intern/club/index.tsx
import { createFileRoute, Link } from '@tanstack/react-router';
import { Calendar, FileText, Mail, TrendingUp, Users } from 'lucide-react';

import { Badge } from '@/shared/shadcn/badge';
import { Button } from '@/shared/shadcn/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/shadcn/card';
import { Container } from '@/shared/ui';

export const Route = createFileRoute('/intern/club/')({
  component: ClubOverview,
});

function ClubOverview() {
  return (
    <Container className="py-8">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-[var(--color-fanini-blue)]">Vereinsübersicht</h1>
          <p className="text-muted-foreground mt-2">
            Zentrale Verwaltung und aktuelle Informationen
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-muted-foreground text-sm font-medium">
                Mitglieder
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">156</div>
              <p className="text-muted-foreground text-xs">+12 dieses Jahr</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-muted-foreground text-sm font-medium">
                Aktive Events
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-muted-foreground text-xs">Nächste 30 Tage</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-muted-foreground text-sm font-medium">
                Newsletter-Abos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">342</div>
              <p className="text-muted-foreground text-xs">92% Öffnungsrate</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-muted-foreground text-sm font-medium">
                Vereinsjahr
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2025</div>
              <p className="text-muted-foreground text-xs">Gegründet 2025</p>
            </CardContent>
          </Card>
        </div>

        {/* Coming Soon Card */}
        <Card className="border-2 border-dashed">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 inline-flex rounded-full bg-gradient-to-r from-[var(--color-fanini-blue)] to-[var(--color-fanini-red)] p-4">
              <Users className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl">Vereins-Dashboard entsteht...</CardTitle>
            <CardDescription className="mx-auto mt-2 max-w-2xl">
              Eine zentrale Übersicht mit allen wichtigen Vereinsinformationen, Statistiken und
              Quick-Links zu häufig genutzten Funktionen.
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Management Areas */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-[var(--color-fanini-blue)]" />
                Newsletter-Verwaltung
              </CardTitle>
              <CardDescription>Kommunikation mit Mitgliedern und Interessenten</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Letzter Newsletter</span>
                  <Badge variant="secondary">vor 5 Tagen</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Entwürfe</span>
                  <Badge variant="outline">3</Badge>
                </div>
              </div>
              <Button asChild className="w-full" variant="outline">
                <Link to="/intern/club/newsletter">Newsletter verwalten</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-[var(--color-fanini-blue)]" />
                Dokumente
              </CardTitle>
              <CardDescription>Offizielle Vereinsdokumente und Vorlagen</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Satzung</span>
                  <Badge variant="secondary">Aktuell</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Vorlagen</span>
                  <Badge variant="outline">12</Badge>
                </div>
              </div>
              <Button asChild className="w-full" variant="outline">
                <Link to="/intern/club/documents">Dokumente verwalten</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Features */}
        <Card>
          <CardHeader>
            <CardTitle>Geplante Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-3">
              <div className="flex items-start gap-3">
                <Calendar className="mt-0.5 h-5 w-5 text-[var(--color-fanini-blue)]" />
                <div>
                  <p className="text-sm font-medium">Jahreskalender</p>
                  <p className="text-muted-foreground text-xs">
                    Alle Events und Termine im Überblick
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <TrendingUp className="mt-0.5 h-5 w-5 text-[var(--color-fanini-blue)]" />
                <div>
                  <p className="text-sm font-medium">Statistiken</p>
                  <p className="text-muted-foreground text-xs">Detaillierte Vereinsanalysen</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Users className="mt-0.5 h-5 w-5 text-[var(--color-fanini-blue)]" />
                <div>
                  <p className="text-sm font-medium">Mitglieder-Export</p>
                  <p className="text-muted-foreground text-xs">Listen und Berichte generieren</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Container>
  );
}

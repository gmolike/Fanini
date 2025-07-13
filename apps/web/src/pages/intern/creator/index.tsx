// src/pages/intern/creator/index.tsx
import { createFileRoute, Link } from '@tanstack/react-router';
import { BarChart3, Palette, Settings, TrendingUp } from 'lucide-react';

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

export const Route = createFileRoute('/intern/creator/')({
  component: CreatorDashboard,
});

function CreatorDashboard() {
  return (
    <Container className="py-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[var(--color-fanini-blue)]">
              Creator Dashboard
            </h1>
            <p className="text-muted-foreground mt-2">
              Verwalte dein Künstlerprofil und deine Werke
            </p>
          </div>
          <Button asChild className="bg-gradient-to-r from-purple-500 to-amber-500">
            <Link to="/intern/creator/portfolio">
              <Settings className="mr-2 h-4 w-4" />
              Portfolio verwalten
            </Link>
          </Button>
        </div>

        {/* Access Notice */}
        <Card className="border-purple-200 bg-purple-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Palette className="h-5 w-5 text-purple-600" />
              Creator-Bereich
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              Dieser Bereich ist nur für autorisierte Creator zugänglich. Die Autorisierung erfolgt
              durch Beirat oder Vorstand.
            </p>
          </CardContent>
        </Card>

        {/* Coming Soon Card */}
        <Card className="border-2 border-dashed">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 inline-flex rounded-full bg-gradient-to-r from-purple-500 to-amber-500 p-4">
              <Palette className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl">Creator Dashboard entsteht...</CardTitle>
            <CardDescription className="mx-auto mt-2 max-w-2xl">
              Ein professionelles Dashboard für Künstler und Creator im Verein. Verwalte dein
              Portfolio, tracke deine Performance und vernetze dich.
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Features Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <BarChart3 className="mb-2 h-8 w-8 text-purple-500" />
              <CardTitle className="text-lg">Statistiken</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-3 text-sm">
                Detaillierte Einblicke in deine Performance
              </p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Profilaufrufe</span>
                  <Badge variant="secondary">Coming Soon</Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Werk-Interaktionen</span>
                  <Badge variant="secondary">Coming Soon</Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Beliebtestes Werk</span>
                  <Badge variant="secondary">Coming Soon</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <TrendingUp className="mb-2 h-8 w-8 text-amber-500" />
              <CardTitle className="text-lg">Reichweite</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-3 text-sm">Deine Präsenz im Verein</p>
              <div className="space-y-2">
                <Badge variant="outline" className="mr-2">
                  Event-Teilnahmen
                </Badge>
                <Badge variant="outline" className="mr-2">
                  Galerie-Features
                </Badge>
                <Badge variant="outline" className="mr-2">
                  Social Media
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Settings className="mb-2 h-8 w-8 text-indigo-500" />
              <CardTitle className="text-lg">Profil-Tools</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-3 text-sm">Professionelle Funktionen</p>
              <div className="space-y-2 text-sm">
                <div>• Portfolio-Verwaltung</div>
                <div>• Social Media Links</div>
                <div>• Event-Kalender</div>
                <div>• Kontaktoptionen</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Container>
  );
}

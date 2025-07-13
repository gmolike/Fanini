// src/pages/intern/members/[memberId].tsx
import { createFileRoute, useParams } from '@tanstack/react-router';
import { Calendar, Mail, Phone, Shield, Star, Trophy, Users } from 'lucide-react';

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

export const Route = createFileRoute('/intern/members/$memberId')({
  component: MemberDetailPage,
});

function MemberDetailPage() {
  const { memberId } = useParams({ from: '/intern/members/$memberId' });

  return (
    <Container className="py-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[var(--color-fanini-blue)] to-[var(--color-fanini-red)] text-2xl font-bold text-white">
              MM
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[var(--color-fanini-blue)]">
                Mitgliederprofil
              </h1>
              <p className="text-muted-foreground mt-1">Mitglieds-ID: {memberId}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Mail className="mr-2 h-4 w-4" />
              Nachricht
            </Button>
            <Button variant="outline">
              <Phone className="mr-2 h-4 w-4" />
              Anrufen
            </Button>
          </div>
        </div>

        {/* Coming Soon Card */}
        <Card className="border-2 border-dashed">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 inline-flex rounded-full bg-gradient-to-r from-[var(--color-fanini-blue)] to-[var(--color-fanini-red)] p-4">
              <Users className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl">Mitgliederprofil entsteht...</CardTitle>
            <CardDescription className="mx-auto mt-2 max-w-2xl">
              Detaillierte Ansicht eines Mitglieds mit Kontaktdaten, Rollen, Teams und Aktivitäten.
              Die Sichtbarkeit richtet sich nach den Datenschutzeinstellungen des Mitglieds.
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Profile Preview */}
        <div className="grid gap-6 md:grid-cols-3">
          {/* Basic Info */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Mitgliedsinformationen</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-muted-foreground text-sm font-medium">Name</p>
                  <p className="text-lg">Max Mustermann</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm font-medium">Mitglied seit</p>
                  <p className="text-lg">Januar 2022</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm font-medium">E-Mail</p>
                  <p className="flex items-center gap-2 text-lg">
                    <Mail className="text-muted-foreground h-4 w-4" />
                    <span className="text-muted-foreground italic">Nicht freigegeben</span>
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm font-medium">Telefon</p>
                  <p className="flex items-center gap-2 text-lg">
                    <Phone className="text-muted-foreground h-4 w-4" />
                    <span className="text-muted-foreground italic">Nicht freigegeben</span>
                  </p>
                </div>
              </div>

              <div>
                <p className="text-muted-foreground mb-2 text-sm font-medium">Beschreibung</p>
                <p className="text-muted-foreground text-sm italic">
                  Noch keine Beschreibung hinzugefügt
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Roles & Teams */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-[var(--color-fanini-blue)]" />
                Rollen & Teams
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-muted-foreground mb-2 text-sm font-medium">Rolle</p>
                <Badge variant="outline" className="border-blue-200 bg-blue-100 text-blue-700">
                  <Shield className="mr-1 h-3 w-3" />
                  Beirat
                </Badge>
              </div>
              <div>
                <p className="text-muted-foreground mb-2 text-sm font-medium">Teams</p>
                <div className="space-y-2">
                  <Badge variant="secondary">Team Event</Badge>
                  <Badge variant="secondary">Team Medien</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Activity & Stats */}
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-[var(--color-fanini-blue)]" />
                Event-Aktivität
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm">Teilnahmen</span>
                  <span className="font-semibold">24</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Organisiert</span>
                  <span className="font-semibold">8</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Dieses Jahr</span>
                  <span className="font-semibold">12</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 text-[var(--color-fanini-blue)]" />
                Aufgaben
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm">Erledigt</span>
                  <span className="font-semibold">45</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">In Arbeit</span>
                  <span className="font-semibold">3</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Überfällig</span>
                  <span className="font-semibold text-red-600">0</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-[var(--color-fanini-blue)]" />
                Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="bg-amber-50">
                  🏆 Gründungsmitglied
                </Badge>
                <Badge variant="outline" className="bg-purple-50">
                  🎉 Party-Organisator
                </Badge>
                <Badge variant="outline" className="bg-blue-50">
                  🚌 Auswärtsfahrer
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Privacy Notice */}
        <Card className="border-amber-200 bg-amber-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Shield className="h-5 w-5 text-amber-600" />
              Datenschutz-Hinweis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              Die Sichtbarkeit von Kontaktdaten und persönlichen Informationen wird durch die
              Datenschutzeinstellungen des jeweiligen Mitglieds gesteuert. Respektiere die
              Privatsphäre deiner Vereinskollegen.
            </p>
          </CardContent>
        </Card>
      </div>
    </Container>
  );
}

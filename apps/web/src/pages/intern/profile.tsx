// src/pages/intern/profile.tsx
import { createFileRoute } from '@tanstack/react-router';
import { Camera, Eye, EyeOff, Lock, Mail, Phone, Save, User } from 'lucide-react';

import { Badge } from '@/shared/shadcn/badge';
import { Button } from '@/shared/shadcn/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/shadcn/card';
import { Container } from '@/shared/ui';

export const Route = createFileRoute('/intern/profile')({
  component: ProfilePage,
});

function ProfilePage() {
  return (
    <Container className="py-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[var(--color-fanini-blue)]">Mein Profil</h1>
            <p className="text-muted-foreground mt-2">
              Verwalte deine persönlichen Informationen und Einstellungen
            </p>
          </div>
          <Button className="bg-gradient-to-r from-[var(--color-fanini-blue)] to-[var(--color-fanini-red)]">
            <Save className="mr-2 h-4 w-4" />
            Änderungen speichern
          </Button>
        </div>

        {/* Coming Soon Card */}
        <Card className="border-2 border-dashed">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 inline-flex rounded-full bg-gradient-to-r from-[var(--color-fanini-blue)] to-[var(--color-fanini-red)] p-4">
              <User className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl">Profilverwaltung entsteht...</CardTitle>
            <CardDescription className="mx-auto mt-2 max-w-2xl">
              Bearbeite deine persönlichen Daten, verwalte deine Sichtbarkeitseinstellungen und
              personalisiere dein Profil.
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Profile Sections Preview */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-[var(--color-fanini-blue)]" />
                Persönliche Daten
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[var(--color-fanini-blue)] to-[var(--color-fanini-red)] text-2xl font-bold text-white">
                    MM
                  </div>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="absolute -right-2 -bottom-2 h-8 w-8 rounded-full p-0"
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                </div>
                <div>
                  <p className="font-medium">Profilbild ändern</p>
                  <p className="text-muted-foreground text-sm">JPG, PNG bis 5MB</p>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-muted-foreground text-sm font-medium">Name</p>
                  <p className="text-base">Max Mustermann</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm font-medium">E-Mail</p>
                  <p className="flex items-center gap-2 text-base">
                    <Mail className="text-muted-foreground h-4 w-4" />
                    max@fanini.test
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm font-medium">Telefon</p>
                  <p className="flex items-center gap-2 text-base">
                    <Phone className="text-muted-foreground h-4 w-4" />
                    +49 123 456789
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Privacy Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-[var(--color-fanini-blue)]" />
                Sichtbarkeitseinstellungen
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between rounded-lg border p-3">
                  <div className="flex items-center gap-2">
                    <Mail className="text-muted-foreground h-4 w-4" />
                    <div>
                      <p className="text-sm font-medium">E-Mail-Adresse</p>
                      <p className="text-muted-foreground text-xs">Wer kann deine E-Mail sehen?</p>
                    </div>
                  </div>
                  <Badge variant="secondary">
                    <EyeOff className="mr-1 h-3 w-3" />
                    Nur ich
                  </Badge>
                </div>

                <div className="flex items-center justify-between rounded-lg border p-3">
                  <div className="flex items-center gap-2">
                    <Phone className="text-muted-foreground h-4 w-4" />
                    <div>
                      <p className="text-sm font-medium">Telefonnummer</p>
                      <p className="text-muted-foreground text-xs">Wer kann deine Nummer sehen?</p>
                    </div>
                  </div>
                  <Badge variant="secondary">
                    <Eye className="mr-1 h-3 w-3" />
                    Mitglieder
                  </Badge>
                </div>

                <div className="flex items-center justify-between rounded-lg border p-3">
                  <div className="flex items-center gap-2">
                    <User className="text-muted-foreground h-4 w-4" />
                    <div>
                      <p className="text-sm font-medium">Profil</p>
                      <p className="text-muted-foreground text-xs">Wer kann dein Profil sehen?</p>
                    </div>
                  </div>
                  <Badge variant="secondary">
                    <Eye className="mr-1 h-3 w-3" />
                    Alle
                  </Badge>
                </div>
              </div>

              <p className="text-muted-foreground text-xs">
                Diese Einstellungen bestimmen, wer deine persönlichen Informationen einsehen kann.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Additional Settings */}
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Benachrichtigungen</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-3 text-sm">
                Verwalte deine Benachrichtigungseinstellungen
              </p>
              <Button variant="outline" className="w-full">
                Einstellungen öffnen
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Passwort</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-3 text-sm">
                Ändere dein Passwort (verfügbar in Phase 2)
              </p>
              <Button variant="outline" className="w-full" disabled>
                Passwort ändern
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Konto</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-3 text-sm">
                Verwalte deine Kontoeinstellungen
              </p>
              <Button variant="outline" className="w-full">
                Kontoeinstellungen
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </Container>
  );
}

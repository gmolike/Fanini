// apps/web/src/pages/intern/members/index.tsx
import { createFileRoute, Link } from '@tanstack/react-router';
import { Mail, Phone, Search, Shield, UserPlus, Users } from 'lucide-react';

import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
} from '@/shared/shadcn';
import { Container } from '@/shared/ui';

export const Route = createFileRoute('/intern/members/')({
  component: MembersPage,
});

type MemberRole = {
  id: string;
  name: string;
  color: string;
};

type Member = {
  id: string;
  vorname: string;
  nachname: string;
  email: string;
  telefon?: string;
  profilbild?: string;
  roles: MemberRole[];
  mitgliedSeit: string;
  istAktiv: boolean;
};

const MOCK_MEMBERS: Member[] = [
  {
    id: '1',
    vorname: 'Max',
    nachname: 'Mustermann',
    email: 'max.mustermann@example.com',
    telefon: '+49 170 1234567',
    roles: [{ id: 'vorstand', name: 'Vorstand', color: 'from-amber-500 to-amber-600' }],
    mitgliedSeit: '2020-01-15',
    istAktiv: true,
  },
  {
    id: '2',
    vorname: 'Anna',
    nachname: 'Schmidt',
    email: 'anna.schmidt@example.com',
    roles: [
      { id: 'event', name: 'Team Event', color: 'from-purple-500 to-purple-600' },
      { id: 'medien', name: 'Team Medien', color: 'from-pink-500 to-pink-600' },
    ],
    mitgliedSeit: '2021-06-01',
    istAktiv: true,
  },
];

function MembersPage() {
  return (
    <Container className="py-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[var(--color-fanini-blue)]">Mitglieder</h1>
            <p className="text-muted-foreground mt-2">Übersicht aller Vereinsmitglieder</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <UserPlus className="mr-2 h-4 w-4" />
              Mitglied einladen
            </Button>
          </div>
        </div>

        {/* Search and Filter */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                <Input placeholder="Mitglieder suchen..." className="pl-10" />
              </div>
              <Button variant="outline">Filter</Button>
            </div>
          </CardContent>
        </Card>

        {/* Members Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {MOCK_MEMBERS.map(member => (
            <Card key={member.id} className="transition-shadow hover:shadow-lg">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-[var(--color-fanini-blue)] to-[var(--color-fanini-red)] font-semibold text-white">
                      {member.vorname[0]}
                      {member.nachname[0]}
                    </div>
                    <div>
                      <CardTitle className="text-lg">
                        {member.vorname} {member.nachname}
                      </CardTitle>
                      <CardDescription className="text-xs">
                        Mitglied seit {new Date(member.mitgliedSeit).toLocaleDateString('de-DE')}
                      </CardDescription>
                    </div>
                  </div>
                  {member.istAktiv ? <Badge variant="outline" className="border-green-200 text-green-600">
                      Aktiv
                    </Badge> : null}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Roles */}
                {member.roles.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {member.roles.map(role => (
                      <Badge
                        key={role.id}
                        className={`bg-gradient-to-r ${role.color} border-0 text-white`}
                      >
                        {role.name}
                      </Badge>
                    ))}
                  </div>
                )}

                {/* Contact Info */}
                <div className="space-y-2 text-sm">
                  <div className="text-muted-foreground flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    <span className="truncate">{member.email}</span>
                  </div>
                  {member.telefon ? <div className="text-muted-foreground flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      <span>{member.telefon}</span>
                    </div> : null}
                </div>

                {/* Actions */}
                <Button asChild className="w-full" variant="outline">
                  <Link to={`/intern/members/${member.id}`}>Profil anzeigen</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Coming Soon Notice */}
        <Card className="border-2 border-dashed">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 inline-flex rounded-full bg-gradient-to-r from-[var(--color-fanini-blue)] to-[var(--color-fanini-red)] p-4">
              <Users className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl">Erweiterte Funktionen kommen...</CardTitle>
            <CardDescription className="mx-auto mt-2 max-w-2xl">
              Erweiterte Filter, Exportfunktionen und Mitgliederverwaltung werden bald verfügbar
              sein.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 text-center md:grid-cols-3">
              <div>
                <Shield className="mx-auto mb-2 h-8 w-8 text-[var(--color-fanini-blue)]" />
                <p className="font-medium">Rollen-Verwaltung</p>
                <p className="text-muted-foreground text-sm">Berechtigungen zuweisen</p>
              </div>
              <div>
                <Mail className="mx-auto mb-2 h-8 w-8 text-[var(--color-fanini-blue)]" />
                <p className="font-medium">Massen-E-Mails</p>
                <p className="text-muted-foreground text-sm">Newsletter versenden</p>
              </div>
              <div>
                <UserPlus className="mx-auto mb-2 h-8 w-8 text-[var(--color-fanini-blue)]" />
                <p className="font-medium">Import/Export</p>
                <p className="text-muted-foreground text-sm">Mitgliederdaten verwalten</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Container>
  );
}

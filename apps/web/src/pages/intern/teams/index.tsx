// apps/web/src/pages/intern/teams/index.tsx
import { createFileRoute, Link } from '@tanstack/react-router';
import { Calendar, Camera, Crown, Laptop, Shield, Users } from 'lucide-react';

import { Badge } from '@/shared/shadcn/badge';
import { Button } from '@/shared/shadcn/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/shadcn/card';
import { Container } from '@/shared/ui';

export const Route = createFileRoute('/intern/teams/')({
  component: TeamsOverviewPage,
});

type Team = {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  memberCount: number;
  activeProjects: number;
  color: string;
};

const TEAMS: Team[] = [
  {
    id: 'vorstand',
    name: 'Vorstand',
    slug: 'vorstand',
    description: 'Vereinsführung und strategische Entscheidungen',
    icon: Crown,
    memberCount: 5,
    activeProjects: 12,
    color: 'from-amber-500 to-amber-600',
  },
  {
    id: 'beirat',
    name: 'Beirat',
    slug: 'beirat',
    description: 'Beratung und Unterstützung des Vorstands',
    icon: Shield,
    memberCount: 8,
    activeProjects: 6,
    color: 'from-blue-500 to-blue-600',
  },
  {
    id: 'event',
    name: 'Team Event',
    slug: 'event',
    description: 'Planung und Durchführung von Veranstaltungen',
    icon: Calendar,
    memberCount: 12,
    activeProjects: 15,
    color: 'from-purple-500 to-purple-600',
  },
  {
    id: 'medien',
    name: 'Team Medien',
    slug: 'medien',
    description: 'Social Media, Fotos und Öffentlichkeitsarbeit',
    icon: Camera,
    memberCount: 6,
    activeProjects: 8,
    color: 'from-pink-500 to-pink-600',
  },
  {
    id: 'verein',
    name: 'Team Verein',
    slug: 'verein',
    description: 'Verwaltung und interne Kommunikation',
    icon: Users,
    memberCount: 4,
    activeProjects: 5,
    color: 'from-green-500 to-green-600',
  },
  {
    id: 'technik',
    name: 'Team Technik',
    slug: 'technik',
    description: 'IT-Support und technische Infrastruktur',
    icon: Laptop,
    memberCount: 3,
    activeProjects: 7,
    color: 'from-indigo-500 to-indigo-600',
  },
];

function TeamsOverviewPage() {
  return (
    <Container className="py-8">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-[var(--color-fanini-blue)]">Teams</h1>
          <p className="text-muted-foreground mt-2">
            Übersicht aller Teams und Arbeitsgruppen im Verein
          </p>
        </div>

        {/* Teams Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {TEAMS.map(team => {
            const Icon = team.icon;
            return (
              <Card key={team.id} className="overflow-hidden transition-shadow hover:shadow-lg">
                <div className={`h-2 bg-gradient-to-r ${team.color}`} />
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className={`inline-flex rounded-lg bg-gradient-to-r ${team.color} p-3`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <Badge variant="secondary">{team.memberCount} Mitglieder</Badge>
                  </div>
                  <CardTitle className="mt-4">{team.name}</CardTitle>
                  <CardDescription>{team.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Aktive Projekte</span>
                    <span className="font-semibold">{team.activeProjects}</span>
                  </div>
                  <Button asChild className="mt-4 w-full" variant="outline">
                    <Link to={`/intern/teams/${team.slug}`}>Team-Bereich öffnen</Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </Container>
  );
}

// Export TeamPage component for use in individual team pages
export type TeamPageProps = {
  teamId: string;
  teamName: string;
  teamDescription: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  features: string[];
};

export function TeamPage({
  teamName,
  teamDescription,
  icon: Icon,
  color,
  features,
}: Readonly<TeamPageProps>) {
  return (
    <Container className="py-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <div className={`inline-flex rounded-xl bg-gradient-to-r ${color} p-4`}>
            <Icon className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-[var(--color-fanini-blue)]">{teamName}</h1>
            <p className="text-muted-foreground mt-1">{teamDescription}</p>
          </div>
        </div>

        {/* Coming Soon Card */}
        <Card className="border-2 border-dashed">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">{teamName}-Dashboard entsteht...</CardTitle>
            <CardDescription className="mx-auto mt-2 max-w-2xl">
              Ein dedizierter Bereich für {teamName} mit spezialisierten Funktionen und Tools.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              {features.map(feature => (
                <div key={feature} className="flex items-start gap-3">
                  <div className={`rounded-full bg-gradient-to-r ${color} p-1`}>
                    <div className="h-2 w-2 rounded-full bg-white" />
                  </div>
                  <p className="text-sm">{feature}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Container>
  );
}

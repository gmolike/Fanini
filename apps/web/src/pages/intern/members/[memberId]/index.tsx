// apps/web/src/pages/intern/members/[memberId]/index.tsx
import { createFileRoute, Link, useParams } from '@tanstack/react-router';
import {
  ArrowLeft,
  Calendar,
  CheckCircle,
  Edit,
  Mail,
  MapPin,
  Phone,
  Shield,
  User,
} from 'lucide-react';

import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/shared/shadcn';
import { Container } from '@/shared/ui';

export const Route = createFileRoute('/intern/members/[memberId]/')({
  component: MemberDetailPage,
});

function MemberDetailPage() {
  const { memberId } = useParams({ from: '/intern/members/$memberId/' });

  return (
    <Container className="py-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <Button asChild variant="ghost" size="icon">
              <Link to="/intern/members">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-[var(--color-fanini-blue)]">
                Mitgliederprofil
              </h1>
              <p className="text-muted-foreground mt-1">Mitglieds-ID: {memberId}</p>
            </div>
          </div>
          <Button variant="outline">
            <Edit className="mr-2 h-4 w-4" />
            Profil bearbeiten
          </Button>
        </div>

        {/* Profile Overview */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col gap-6 md:flex-row">
              {/* Avatar */}
              <div className="flex-shrink-0">
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-r from-[var(--color-fanini-blue)] to-[var(--color-fanini-red)] text-2xl font-bold text-white">
                  MM
                </div>
              </div>

              {/* Basic Info */}
              <div className="flex-1 space-y-4">
                <div>
                  <h2 className="text-2xl font-semibold">Max Mustermann</h2>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <Badge className="border-0 bg-gradient-to-r from-amber-500 to-amber-600 text-white">
                      Vorstand
                    </Badge>
                    <Badge variant="outline" className="border-green-200 text-green-600">
                      <CheckCircle className="mr-1 h-3 w-3" />
                      Aktiv
                    </Badge>
                    <Badge variant="outline">
                      <Calendar className="mr-1 h-3 w-3" />
                      Mitglied seit 2020
                    </Badge>
                  </div>
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="text-muted-foreground h-4 w-4" />
                    <span>max.mustermann@example.com</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="text-muted-foreground h-4 w-4" />
                    <span>+49 170 1234567</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="text-muted-foreground h-4 w-4" />
                    <span>Berlin, Deutschland</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Shield className="text-muted-foreground h-4 w-4" />
                    <span>Vertraulichkeitserklärung: ✓</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs for Details */}
        <Tabs defaultValue="overview">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Übersicht</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="tasks">Aufgaben</TabsTrigger>
            <TabsTrigger value="activity">Aktivität</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <Card className="border-2 border-dashed">
              <CardHeader className="text-center">
                <User className="mx-auto mb-2 h-8 w-8 text-[var(--color-fanini-blue)]" />
                <CardTitle>Profil-Übersicht entsteht...</CardTitle>
                <CardDescription>Detaillierte Informationen über das Mitglied</CardDescription>
              </CardHeader>
            </Card>
          </TabsContent>

          <TabsContent value="events" className="space-y-4">
            <Card className="border-2 border-dashed">
              <CardHeader className="text-center">
                <Calendar className="mx-auto mb-2 h-8 w-8 text-[var(--color-fanini-blue)]" />
                <CardTitle>Event-Historie entsteht...</CardTitle>
                <CardDescription>Teilnahme an vergangenen und zukünftigen Events</CardDescription>
              </CardHeader>
            </Card>
          </TabsContent>

          <TabsContent value="tasks" className="space-y-4">
            <Card className="border-2 border-dashed">
              <CardHeader className="text-center">
                <CheckCircle className="mx-auto mb-2 h-8 w-8 text-[var(--color-fanini-blue)]" />
                <CardTitle>Aufgaben-Übersicht entsteht...</CardTitle>
                <CardDescription>Zugewiesene und abgeschlossene Aufgaben</CardDescription>
              </CardHeader>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="space-y-4">
            <Card className="border-2 border-dashed">
              <CardHeader className="text-center">
                <CardTitle>Aktivitäts-Log entsteht...</CardTitle>
                <CardDescription>Letzte Aktivitäten und Beiträge</CardDescription>
              </CardHeader>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Container>
  );
}

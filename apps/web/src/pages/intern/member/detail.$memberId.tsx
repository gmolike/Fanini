// apps/web/src/pages/intern/member/detail.$memberId.tsx
import { createFileRoute } from '@tanstack/react-router';
import { Link } from '@tanstack/react-router';
import { ArrowLeft, User } from 'lucide-react';

import {
  Button,
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  Container,
  PageHeader,
} from '@/shared/ui';

export const Route = createFileRoute('/intern/member/detail/$memberId')({
  component: MemberDetailPage,
});

function MemberDetailPage() {
  const { memberId } = Route.useParams();

  return (
    <Container className="py-8">
      <PageHeader
        title="Mitgliederprofil"
        description={`Mitglieds-ID: ${memberId}`}
        breadcrumb={
          <div className="flex items-center gap-2">
            <Link
              to="/intern/member/list"
              className="text-muted-foreground hover:text-foreground flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Zurück zur Liste
            </Link>
          </div>
        }
        actions={<Button variant="outline">Profil bearbeiten</Button>}
      />

      <Card className="mt-6 border-2 border-dashed">
        <CardHeader className="text-center">
          <User className="mx-auto mb-2 h-8 w-8 text-[var(--color-fanini-blue)]" />
          <CardTitle>Mitgliederdetails werden geladen...</CardTitle>
          <CardDescription>
            Die vollständige Implementierung folgt in einem separaten Part
          </CardDescription>
        </CardHeader>
      </Card>
    </Container>
  );
}

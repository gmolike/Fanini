// apps/web/src/pages/intern/member/list.tsx
import { useState } from 'react';

import { createFileRoute } from '@tanstack/react-router';
import { Plus, Users } from 'lucide-react';

import { CreateMemberDialog } from '@/features/intern/member-create';

import {
  Button,
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  Container,
  PageHeader,
} from '@/shared/ui';

export const Route = createFileRoute('/intern/member/list')({
  component: MemberListPage,
});

function MemberListPage() {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  return (
    <>
      <Container className="py-8">
        <PageHeader
          title="Mitglieder verwalten"
          description="Alle Vereinsmitglieder im Überblick"
          actions={
            <Button onClick={() => { setCreateDialogOpen(true); }}>
              <Plus className="mr-2 h-4 w-4" />
              Lokales Mitglied anlegen
            </Button>
          }
        />

        <Card className="mt-6 border-2 border-dashed">
          <CardHeader className="text-center">
            <Users className="mx-auto mb-2 h-8 w-8 text-[var(--color-fanini-blue)]" />
            <CardTitle>Mitgliederliste wird geladen...</CardTitle>
            <CardDescription>
              Die vollständige Implementierung folgt in einem separaten Part
            </CardDescription>
          </CardHeader>
        </Card>
      </Container>

      <CreateMemberDialog open={createDialogOpen} onOpenChange={setCreateDialogOpen} />
    </>
  );
}

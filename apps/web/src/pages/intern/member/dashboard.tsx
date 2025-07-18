// apps/web/src/pages/intern/member/dashboard.tsx
import { createFileRoute } from '@tanstack/react-router';
import { LayoutDashboard } from 'lucide-react';

import { Card, CardDescription,CardHeader, CardTitle, Container, PageHeader } from '@/shared/ui';

export const Route = createFileRoute('/intern/member/dashboard')({
  component: MemberDashboardPage,
});

function MemberDashboardPage() {
  return (
    <Container className="py-8">
      <PageHeader
        title="Mitglieder Dashboard"
        description="Übersicht und Statistiken zu den Vereinsmitgliedern"
      />

      <Card className="mt-6 border-2 border-dashed">
        <CardHeader className="text-center">
          <LayoutDashboard className="mx-auto mb-2 h-8 w-8 text-[var(--color-fanini-blue)]" />
          <CardTitle>Dashboard wird entwickelt...</CardTitle>
          <CardDescription>Statistiken, Diagramme und Insights kommen bald</CardDescription>
        </CardHeader>
      </Card>
    </Container>
  );
}

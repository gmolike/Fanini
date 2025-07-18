import { createFileRoute } from '@tanstack/react-router';

import { MemberListContent } from '@/features/intern/member-list';

import { Container, PageHeader } from '@/shared/ui';

export const Route = createFileRoute('/intern/member/list')({
  component: MemberListPage,
});

function MemberListPage() {
  return (
    <Container className="py-8">
      <PageHeader title="Mitglieder verwalten" description="Alle Vereinsmitglieder im Überblick" />

      <MemberListContent />
    </Container>
  );
}

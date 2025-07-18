import { createFileRoute, Link, useParams } from '@tanstack/react-router';
import { ArrowLeft } from 'lucide-react';

import { MemberDetailContent } from '@/features/intern/member';

import { Container, PageHeader } from '@/shared/ui';

export const Route = createFileRoute('/intern/member/detail/$memberId')({
  component: MemberDetailPage,
});

function MemberDetailPage() {
  const { memberId } = useParams({ from: '/intern/member/detail/$memberId' });

  return (
    <Container className="py-8">
      <PageHeader
        title="Mitgliederprofil"
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
      />

      <MemberDetailContent memberId={memberId} />
    </Container>
  );
}

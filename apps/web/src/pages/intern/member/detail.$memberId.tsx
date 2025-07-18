// apps/web/src/pages/intern/member/detail.$memberId.tsx
import { createFileRoute, useParams } from '@tanstack/react-router';

import { MemberDetailContent } from '@/features/intern/member';

export const Route = createFileRoute('/intern/member/detail/$memberId')({
  component: MemberDetailPage,
});

function MemberDetailPage() {
  const { memberId } = useParams({ from: '/intern/member/detail/$memberId' });

  return <MemberDetailContent memberId={memberId} />;
}

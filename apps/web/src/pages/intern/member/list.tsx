// apps/web/src/pages/intern/member/list.tsx
import { createFileRoute } from '@tanstack/react-router';

import { MemberListContent } from '@/features/intern/member';

export const Route = createFileRoute('/intern/member/list')({
  component: MemberListPage,
});

function MemberListPage() {
  return <MemberListContent />;
}

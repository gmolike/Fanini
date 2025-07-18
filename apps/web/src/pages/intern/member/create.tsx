// apps/web/src/pages/intern/member/create.tsx
import { createFileRoute, useNavigate } from '@tanstack/react-router';

import { MemberForm } from '@/features/intern/member';

export const Route = createFileRoute('/intern/member/create')({
  component: MemberCreatePage,
});

function MemberCreatePage() {
  const navigate = useNavigate();

  const handleSuccess = () => {
    void navigate({ to: '/intern/member/list' });
  };

  const handleCancel = () => {
    void navigate({ to: '/intern/member/list' });
  };

  return (
    <div className="mt-6">
      <MemberForm mode="create" onSuccess={handleSuccess} onCancel={handleCancel} />
    </div>
  );
}

// apps/web/src/pages/intern/member/edit.$memberId.tsx
import { createFileRoute, useNavigate, useParams } from '@tanstack/react-router';

import { MemberForm } from '@/features/intern/member';

import {
  type MemberDetail,
  type MemberRole,
  useMemberDetail,
  useUserPermissions,
} from '@/entities/intern/member';

import { LoadingState } from '@/shared/ui';

export const Route = createFileRoute('/intern/member/edit/$memberId')({
  component: MemberEditPage,
});

function MemberEditPage() {
  const navigate = useNavigate();
  const { memberId } = useParams({ from: '/intern/member/edit/$memberId' });

  const memberQuery = useMemberDetail({ memberId });
  const permissionsQuery = useUserPermissions();

  const handleSuccess = () => {
    void navigate({
      to: '/intern/member/detail/$memberId',
      params: { memberId },
    });
  };

  // eslint-disable-next-line sonarjs/no-identical-functions
  const handleCancel = () => {
    void navigate({
      to: '/intern/member/detail/$memberId',
      params: { memberId },
    });
  };

  return (
    <div className="mt-6">
      <LoadingState query={memberQuery}>
        {data => {
          // Cast rolle to MemberRole[]
          const memberData: MemberDetail = {
            ...data.data,
            rolle: data.data.rolle as MemberRole[],
          };

          return (
            <MemberForm
              mode="edit"
              initialData={memberData}
              userPermissions={permissionsQuery.data}
              onSuccess={handleSuccess}
              onCancel={handleCancel}
            />
          );
        }}
      </LoadingState>
    </div>
  );
}

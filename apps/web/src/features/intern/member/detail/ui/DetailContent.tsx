// apps/web/src/features/intern/member/detail/ui/DetailContent.tsx

import { useNavigate } from '@tanstack/react-router';

import {
  canEditMember,
  canViewSensitiveData,
  type MemberDetail,
  type MemberRole,
  needsApproval,
  useMemberDetail,
} from '@/entities/intern/member';

import { useSafePermissions } from '../hooks/useSafePermissions';

import { ActionsCard } from './ActionsCard';
import { ContactCard } from './ContactCard';
import { InfoCard } from './InfoCard';
import { RolesCard } from './RolesCard';

type DetailContentProps = {
  memberId: string;
};

export const DetailContent = ({ memberId }: DetailContentProps) => {
  const navigate = useNavigate();

  const {
    data: memberData,
    isLoading: memberLoading,
    error: memberError,
  } = useMemberDetail({ memberId });
  const { userRole, userId: currentUserId, isLoading: permissionsLoading } = useSafePermissions();

  if (memberLoading || permissionsLoading) {
    return <div>Mitgliederdaten werden geladen...</div>;
  }

  if (memberError || !memberData?.data) {
    void navigate({ to: '/intern/member/list' });
    return null;
  }

  // Cast rolle zu MemberRole[]
  const member: MemberDetail = {
    ...memberData.data,
    rolle: memberData.data.rolle as MemberRole[],
  };

  // Permission checks - userRole ist jetzt immer definiert durch useSafePermissions
  const canViewHigh = canViewSensitiveData(userRole, 'high');
  const canEdit = canEditMember(userRole, member.id, currentUserId);
  const requiresApproval = needsApproval(userRole);

  // Role-based permissions
  const canManageRoles = ['ADMIN', 'VORSTAND', 'BEIRAT'].includes(userRole);
  const canResetPassword = ['ADMIN', 'VORSTAND', 'BEIRAT'].includes(userRole);
  const canToggleStatus = ['ADMIN', 'VORSTAND', 'BEIRAT'].includes(userRole);
  const canDelete = userRole === 'ADMIN' || userRole === 'VORSTAND';
  const handleEdit = () => {
    void navigate({
      to: '/intern/member/edit/$memberId',
      params: { memberId: member.id },
    });
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Left Column */}
      <div className="space-y-6">
        <InfoCard member={member} canViewSensitiveData={canViewHigh} />
        <ContactCard member={member} canViewSensitiveData={canViewHigh} />
      </div>

      {/* Right Column */}
      <div className="space-y-6">
        <RolesCard member={member} canManageRoles={canManageRoles} userRole={userRole} />
        <ActionsCard
          member={member}
          canResetPassword={canResetPassword}
          canToggleStatus={canToggleStatus}
          canDelete={canDelete}
          needsApproval={requiresApproval}
          onEdit={canEdit ? handleEdit : undefined}
        />
      </div>
    </div>
  );
};

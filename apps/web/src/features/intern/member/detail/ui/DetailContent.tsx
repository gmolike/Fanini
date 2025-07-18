import { useState } from 'react';

import { useNavigate } from '@tanstack/react-router';

import { EditDialog } from '@/features/intern/member/edit/ui/EditDialog';

import {
  canEditMember,
  canViewSensitiveData,
  type MemberDetail,
  type MemberRole,
  needsApproval,
  useMemberDetail,
  useUserPermissions,
} from '@/entities/intern/member';

import { ActionsCard } from './ActionsCard';
import { ContactCard } from './ContactCard';
import { InfoCard } from './InfoCard';
import { RolesCard } from './RolesCard';

type DetailContentProps = {
  memberId: string;
};

export const DetailContent = ({ memberId }: DetailContentProps) => {
  const navigate = useNavigate();
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const { data: memberData, isLoading, error } = useMemberDetail({ memberId });
  const { data: permissions } = useUserPermissions();

  if (isLoading) {
    return <div>Mitgliederdaten werden geladen...</div>;
  }

  if (error || !memberData?.data) {
    void navigate({ to: '/intern/member/list' });
    return null;
  }

  // Cast rolle zu MemberRole[]
  const member: MemberDetail = {
    ...memberData.data,
    rolle: memberData.data.rolle as MemberRole[],
  };

  const userRole = permissions?.role;
  const currentUserId = permissions?.userId ?? '';

  // Permission checks
  const canViewHigh = canViewSensitiveData(userRole, 'high');
  // canViewCritical entfernt - wird nicht genutzt
  const canEdit = canEditMember(userRole, member.id, currentUserId);
  const requiresApproval = needsApproval(userRole);

  const canManageRoles = ['ADMIN', 'VORSTAND', 'BEIRAT'].includes(userRole ?? '');
  const canResetPassword = ['ADMIN', 'VORSTAND', 'BEIRAT'].includes(userRole ?? '');
  const canToggleStatus = ['ADMIN', 'VORSTAND', 'BEIRAT'].includes(userRole ?? '');
  const canDelete = userRole === 'ADMIN' || userRole === 'VORSTAND';

  return (
    <>
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left Column */}
        <div className="space-y-6">
          <InfoCard member={member} canViewSensitiveData={canViewHigh} />
          <ContactCard member={member} canViewSensitiveData={canViewHigh} />
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <RolesCard
            member={member}
            canManageRoles={canManageRoles}
            userRole={userRole ?? 'MITGLIED'}
          />

          <ActionsCard
            member={member}
            canResetPassword={canResetPassword}
            canToggleStatus={canToggleStatus}
            canDelete={canDelete}
            needsApproval={requiresApproval}
            onEdit={
              canEdit
                ? () => {
                    setEditDialogOpen(true);
                  }
                : undefined
            }
          />
        </div>
      </div>

      {canEdit ? (
        <EditDialog
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          member={member}
          needsApproval={requiresApproval}
        />
      ) : null}
    </>
  );
};

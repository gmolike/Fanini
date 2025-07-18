import { useState } from 'react';

import { useNavigate } from '@tanstack/react-router';

import { EditMemberDialog } from '@/features/intern/member-edit';

import { useMemberDetail, useUserPermissions } from '@/entities/intern/member';

import { LoadingState } from '@/shared/ui';

import {
  canEditMember,
  canViewSensitiveData,
  needsApproval,
} from '../lib/member-detail-permissions';

import { MemberActionsCard } from './MemberActionsCard';
import { MemberContactCard } from './MemberContactCard';
import { MemberInfoCard } from './MemberInfoCard';
import { MemberRolesCard } from './MemberRolesCard';

type MemberDetailContentProps = {
  memberId: string;
};

/**
 * MemberDetailContent Component
 *
 * @description Hauptkomponente für die Mitgliederdetailansicht
 */
export const MemberDetailContent = ({ memberId }: MemberDetailContentProps) => {
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

  const member = memberData.data;
  const userRole = permissions?.role;
  const currentUserId = permissions?.userId ?? '';

  // Permission checks
  const canViewHigh = canViewSensitiveData(userRole, 'high');
  const canViewCritical = canViewSensitiveData(userRole, 'critical');
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
          <MemberInfoCard member={member} canViewSensitiveData={canViewHigh} />

          <MemberContactCard member={member} canViewSensitiveData={canViewHigh} />
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <MemberRolesCard
            member={member}
            canManageRoles={canManageRoles}
            userRole={userRole ?? 'MITGLIED'}
          />

          <MemberActionsCard
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
        <EditMemberDialog
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          member={member}
          needsApproval={requiresApproval}
        />
      ) : null}
    </>
  );
};

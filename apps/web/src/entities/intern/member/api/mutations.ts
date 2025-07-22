// apps/web/src/entities/intern/member/api/mutations.ts
import { createRemoteMutation, queryClient } from '@/shared/api';

import { MEMBER_ENDPOINTS } from './endpoints';

import type {
  AssignRoleRequest,
  CreateLocalMemberRequest,
  CreateLocalMemberResponse,
  SetPasswordRequest,
  SetPasswordResponse,
  UpdateMemberRequest,
} from '../model/types';

// ============================================
// MEMBER MUTATIONS
// ============================================

// Update Member
export const useUpdateMember = createRemoteMutation<UpdateMemberRequest>({
  endpoint: variables => {
    const vars = variables as unknown as UpdateMemberRequest & { memberId: string };
    return MEMBER_ENDPOINTS.detail(vars.memberId);
  },
  method: 'PUT',
  onSuccess: (response, variables) => {
    const vars = variables as unknown as UpdateMemberRequest & { memberId: string };
    if (
      typeof response === 'object' &&
      'needsApproval' in response &&
      response.needsApproval === true
    ) {
      console.info('TODO: Show notification - Changes require approval');
    }
    void queryClient.invalidateQueries({ queryKey: ['members', 'detail', vars.memberId] });
    void queryClient.invalidateQueries({ queryKey: ['members', 'list'] });
  },
});

// Update My Profile
export const useUpdateMyProfile = createRemoteMutation<UpdateMemberRequest>({
  endpoint: MEMBER_ENDPOINTS.updateMe,
  method: 'PUT',
  onSuccess: () => {
    void queryClient.invalidateQueries({ queryKey: ['members', 'my-profile'] });
    void queryClient.invalidateQueries({ queryKey: ['members', 'list'] });
  },
});

// ============================================
// ROLE MUTATIONS
// ============================================

// Assign Role
export const useAssignRole = createRemoteMutation<AssignRoleRequest>({
  endpoint: variables => {
    const vars = variables as unknown as AssignRoleRequest & { memberId: string };
    return MEMBER_ENDPOINTS.roles(vars.memberId);
  },
  method: 'POST',
  onSuccess: (response, variables) => {
    const vars = variables as unknown as AssignRoleRequest & { memberId: string };
    if (
      typeof response === 'object' &&
      'needsApproval' in response &&
      response.needsApproval === true
    ) {
      console.info('TODO: Show notification - Role assignment requires approval');
    }
    void queryClient.invalidateQueries({ queryKey: ['members', 'detail', vars.memberId] });
    void queryClient.invalidateQueries({ queryKey: ['members', 'list'] });
  },
});

// Remove Role
export const useRemoveRole = createRemoteMutation<
  { memberId: string; roleId: string },
  { memberId: string; roleId: string }
>({
  endpoint: variables => {
    return MEMBER_ENDPOINTS.role(variables.memberId, variables.roleId);
  },
  method: 'DELETE',
  onSuccess: (response, variables) => {
    if (
      typeof response === 'object' &&
      'needsApproval' in response &&
      response.needsApproval === true
    ) {
      console.info('TODO: Show notification - Role removal requires approval');
    }
    void queryClient.invalidateQueries({ queryKey: ['members', 'detail', variables.memberId] });
    void queryClient.invalidateQueries({ queryKey: ['members', 'list'] });
  },
});

// ============================================
// STATUS MUTATIONS
// ============================================

// Toggle Member Status
export const useToggleMemberStatus = createRemoteMutation<
  { memberId: string; istAktiv: boolean },
  unknown
>({
  endpoint: (variables: unknown) => {
    const vars = variables as { memberId: string; istAktiv: boolean };
    return MEMBER_ENDPOINTS.status(vars.memberId);
  },
  method: 'PATCH',
  onSuccess: (_, variables) => {
    const vars = variables as { memberId: string; istAktiv: boolean };
    void queryClient.invalidateQueries({ queryKey: ['members', 'detail', vars.memberId] });
    void queryClient.invalidateQueries({ queryKey: ['members', 'list'] });
  },
});

// ============================================
// CREATE & PASSWORD MUTATIONS
// ============================================

// Create Local Member
// Fix die Typen für useCreateLocalMember
export const useCreateLocalMember = createRemoteMutation<
  CreateLocalMemberRequest,
  CreateLocalMemberResponse
>({
  endpoint: MEMBER_ENDPOINTS.local,
  method: 'POST',
  onSuccess: () => {
    void queryClient.invalidateQueries({ queryKey: ['members'] });
  },
});

// Set Member Password
export const useSetMemberPassword = createRemoteMutation<SetPasswordResponse, SetPasswordRequest>({
  endpoint: (variables: SetPasswordRequest) => MEMBER_ENDPOINTS.password(variables.memberId),
  method: 'PUT',
  onSuccess: (_, variables) => {
    void queryClient.invalidateQueries({
      queryKey: ['members', 'detail', variables.memberId],
    });
  },
});

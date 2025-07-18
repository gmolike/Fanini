import { createRemoteMutation, queryClient } from '@/shared/api';

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
    return `/api/members/${vars.memberId}`;
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
  endpoint: '/api/members/me',
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
    return `/api/members/${vars.memberId}/roles`;
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
    return `/api/members/${variables.memberId}/roles/${variables.roleId}`;
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
    return `/api/members/${vars.memberId}/status`;
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
export const useCreateLocalMember = createRemoteMutation<
  CreateLocalMemberRequest,
  CreateLocalMemberResponse
>({
  endpoint: '/api/members/local',
  method: 'POST',
  onSuccess: () => {
    void queryClient.invalidateQueries({ queryKey: ['members'] });
  },
});

// Set Member Password
export const useSetMemberPassword = createRemoteMutation<SetPasswordResponse, SetPasswordRequest>({
  endpoint: (variables: SetPasswordRequest) => `/api/members/${variables.memberId}/password`,
  method: 'PUT',
  onSuccess: (_, variables) => {
    void queryClient.invalidateQueries({
      queryKey: ['members', 'detail', variables.memberId],
    });
  },
});

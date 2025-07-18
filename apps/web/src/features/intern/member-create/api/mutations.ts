// apps/web/src/features/intern/member-create/api/mutations.ts
import { createRemoteMutation, queryClient } from '@/shared/api';

import type { UseMutationResult } from '@tanstack/react-query';

// Request Types
type CreateLocalMemberRequest = {
  vorname: string;
  nachname: string;
  email: string;
  telefon?: string;
  memberType: 'creator' | 'sponsor' | 'partner';
  passwordOption: 'none' | 'generate' | 'manual';
  password?: string;
  kuenstlername?: string;
  portfolio?: string;
  sendCredentials: boolean;
};

type CreateLocalMemberResponse = {
  success: boolean;
  data?: {
    memberId: string;
    userId: string;
    temporaryPassword?: string;
  };
  error?: string;
};

/**
 * Create Local Member Mutation
 */
const mutation = createRemoteMutation<CreateLocalMemberRequest, CreateLocalMemberResponse>({
  endpoint: '/api/members/local',
  method: 'POST',
  onSuccess: () => {
    void queryClient.invalidateQueries({ queryKey: ['members'] });
  },
});

export const useCreateLocalMember = (): UseMutationResult<
  CreateLocalMemberResponse,
  Error,
  CreateLocalMemberRequest
> => {
  return mutation as unknown as UseMutationResult<
    CreateLocalMemberResponse,
    Error,
    CreateLocalMemberRequest
  >;
};
type SetPasswordRequest = {
  memberId: string;
  generateTemporary?: boolean;
  password?: string;
  sendEmail?: boolean;
};

type SetPasswordResponse = {
  success: boolean;
  data?: {
    temporaryPassword?: string;
  };
  error?: string;
};

export const useSetMemberPassword = createRemoteMutation<SetPasswordResponse, SetPasswordRequest>({
  endpoint: (variables: SetPasswordRequest) => `/api/members/${variables.memberId}/password`,
  method: 'PUT',
  onSuccess: (_, variables) => {
    void queryClient.invalidateQueries({
      queryKey: ['members', 'detail', variables.memberId],
    });
  },
});

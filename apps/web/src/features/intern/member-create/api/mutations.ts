// apps/web/src/features/intern/member-create/api/mutations.ts
import { z } from 'zod';

import { createRemoteMutation, queryClient } from '@/shared/api';

const createLocalMemberSchema = z.object({
  vorname: z.string().min(2),
  nachname: z.string().min(2),
  email: z.string().email(),
  telefon: z.string().optional(),
  memberType: z.enum(['creator', 'sponsor', 'partner']),
  passwordOption: z.enum(['none', 'generate', 'manual']),
  password: z.string().optional(),
  kuenstlername: z.string().optional(),
  portfolio: z.string().url().optional(),
  sendCredentials: z.boolean(),
});

type CreateLocalMemberRequest = z.infer<typeof createLocalMemberSchema>;

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
export const useCreateLocalMember = createRemoteMutation;
(CreateLocalMemberRequest,
  CreateLocalMemberResponse >
    {
      endpoint: '/api/members/local',
      method: 'POST',
      onSuccess: () => {
        void queryClient.invalidateQueries({ queryKey: ['members'] });
      },
    });

/**
 * Set Member Password Mutation
 */
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

export const useSetMemberPassword = createRemoteMutation;
(SetPasswordRequest,
  SetPasswordResponse >
    {
      endpoint: variables => `/api/members/${variables.memberId}/password`,
      method: 'PUT',
      onSuccess: (_, variables) => {
        void queryClient.invalidateQueries({
          queryKey: ['members', 'detail', variables.memberId],
        });
      },
    });

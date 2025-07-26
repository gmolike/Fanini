// apps/web/src/entities/auth/api/mutations.ts
import { AUTH_ENDPOINTS } from '@/entities/auth/api/endpoints';

import { createRemoteMutation, queryClient } from '@/shared/api';

import { loginSchema, refreshSchema, registerSchema } from '../model/schemas';

import type { LoginRequest, LoginResponse, RefreshRequest, RegisterRequest } from '../model/types';

export const useLogin = createRemoteMutation<LoginRequest, LoginResponse>({
  endpoint: AUTH_ENDPOINTS.login,
  method: 'POST',
  schema: loginSchema,
  onSuccess: response => {
    // Token handling
    localStorage.setItem('accessToken', response.data.accessToken);
    localStorage.setItem('refreshToken', response.data.refreshToken);

    void queryClient.invalidateQueries({ queryKey: ['user'] });
    void queryClient.invalidateQueries({ queryKey: ['members', 'me'] });
  },
});

export const useRegister = createRemoteMutation<RegisterRequest>({
  endpoint: AUTH_ENDPOINTS.register,
  method: 'POST',
  schema: registerSchema,
});

export const useRefresh = createRemoteMutation<RefreshRequest, LoginResponse>({
  endpoint: AUTH_ENDPOINTS.refresh,
  method: 'POST',
  schema: refreshSchema,
});

export const useLogout = createRemoteMutation({
  endpoint: AUTH_ENDPOINTS.logout,
  method: 'POST',
  onSuccess: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    queryClient.clear();
  },
});

// apps/web/src/entities/auth/api/mutations.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from '@tanstack/react-router';
import { toast } from 'sonner';

import { apiClient, type ApiClientError } from '@/shared/api';

import {
  AUTH_STORAGE_KEYS,
  type LoginRequest,
  type LoginResponse,
  type RefreshRequest,
  type RefreshResponse,
  type RegisterRequest,
  type RegisterResponse,
} from '../model/types';

import { AUTH_ENDPOINTS } from './endpoints';

/**
 * Login Mutation
 * @description Authentifiziert einen Benutzer
 */
export const useLogin = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation<LoginResponse, ApiClientError, LoginRequest>({
    mutationFn: async data => {
      // apiClient extrahiert automatisch das result Feld
      return apiClient.post<LoginResponse>(AUTH_ENDPOINTS.login, data);
    },
    onSuccess: response => {
      // response ist bereits das result Objekt (nicht das wrapper)
      localStorage.setItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN, response.accessToken);
      localStorage.setItem(AUTH_STORAGE_KEYS.REFRESH_TOKEN, response.refreshToken);
      localStorage.setItem(AUTH_STORAGE_KEYS.USER, JSON.stringify(response.user));

      // Invalidate queries
      void queryClient.invalidateQueries({ queryKey: ['user'] });
      void queryClient.invalidateQueries({ queryKey: ['members', 'me'] });

      toast.success('Erfolgreich angemeldet');
      void router.navigate({ to: '/intern' });
    },
    onError: error => {
      if (error.code === 'INVALID_CREDENTIALS') {
        toast.error('Ungültige E-Mail oder Passwort');
      } else if (error.code === 'VALIDATION_ERROR' && error.details?.['fields']) {
        // Zeige Validierungsfehler
        const fields = error.details.fields as Record<string, string | string[]>;
        Object.entries(fields).forEach(([field, messages]) => {
          const message = Array.isArray(messages) ? messages[0] : messages;
          toast.error(`${field}: ${message}`);
        });
      } else {
        toast.error(error.message || 'Anmeldung fehlgeschlagen');
      }
    },
  });
};

/**
 * Register Mutation
 * @description Registriert einen neuen Benutzer
 */
export const useRegister = () => {
  const router = useRouter();

  return useMutation<RegisterResponse, ApiClientError, RegisterRequest>({
    mutationFn: async data => {
      return apiClient.post<RegisterResponse>(AUTH_ENDPOINTS.register, data);
    },
    onSuccess: response => {
      toast.success(
        response.message || 'Registrierung erfolgreich! Bitte überprüfe deine E-Mails.'
      );
      void router.navigate({ to: '/login' });
    },
    onError: error => {
      if (error.code === 'RESOURCE_ALREADY_EXISTS') {
        toast.error('Diese E-Mail-Adresse ist bereits registriert');
      } else if (error.code === 'VALIDATION_ERROR' && error.details?.fields) {
        const fields = error.details.fields as Record<string, string | string[]>;
        Object.entries(fields).forEach(([field, messages]) => {
          const message = Array.isArray(messages) ? messages[0] : messages;
          toast.error(`${field}: ${message}`);
        });
      } else {
        toast.error(error.message || 'Registrierung fehlgeschlagen');
      }
    },
  });
};

/**
 * Refresh Token Mutation
 * @description Erneuert den Access Token
 */
export const useRefreshToken = () => {
  return useMutation<RefreshResponse, ApiClientError, RefreshRequest>({
    mutationFn: async data => {
      return apiClient.post<RefreshResponse>(AUTH_ENDPOINTS.refresh, data);
    },
    onSuccess: response => {
      localStorage.setItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN, response.accessToken);
      localStorage.setItem(AUTH_STORAGE_KEYS.REFRESH_TOKEN, response.refreshToken);

      // Update auth token im apiClient
      apiClient.setAuthToken(response.accessToken);
    },
    onError: error => {
      if (error.code === 'INVALID_TOKEN' || error.code === 'TOKEN_EXPIRED') {
        // Token ungültig - ausloggen
        localStorage.clear();
        apiClient.setAuthToken(null);
        window.location.href = '/auth/login';
      }
    },
  });
};

/**
 * Logout Mutation
 * @description Meldet den Benutzer ab
 */
export const useLogout = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation<{ message: string }, ApiClientError>({
    mutationFn: async () => {
      const refreshToken = localStorage.getItem(AUTH_STORAGE_KEYS.REFRESH_TOKEN);

      // Optional: Sende refresh token zum Server
      const body = refreshToken ? { refreshToken } : undefined;

      return apiClient.post<{ message: string }>(AUTH_ENDPOINTS.logout, body);
    },
    onSuccess: response => {
      // Clear storage
      localStorage.removeItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN);
      localStorage.removeItem(AUTH_STORAGE_KEYS.REFRESH_TOKEN);
      localStorage.removeItem(AUTH_STORAGE_KEYS.USER);

      // Clear auth token
      apiClient.setAuthToken(null);

      // Clear all queries
      queryClient.clear();

      toast.success(response.message || 'Erfolgreich abgemeldet');
      void router.navigate({ to: '/' });
    },
    onError: () => {
      // Auch bei Fehler ausloggen (z.B. wenn Token bereits ungültig)
      localStorage.clear();
      apiClient.setAuthToken(null);
      queryClient.clear();
      void router.navigate({ to: '/' });
    },
  });
};

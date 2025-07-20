/* eslint-disable sonarjs/no-duplicate-string */
// apps/web/src/features/auth/model/authStore.ts
import { create } from 'zustand';

import { apiClient } from '@/shared/api';

import type { AuthUser, LoginCredentials } from './types';

type AuthState = {
  user: AuthUser | null;
  isLoading: boolean;
  checkAuth: () => void;
  setUser: (user: AuthUser | null) => void;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
};

/**
 * Globaler Auth Store
 * @description Verwaltet User-Session und Token mit apiClient Integration
 */
export const useAuthStore = create<AuthState>(set => ({
  user: null,
  isLoading: true,

  checkAuth: () => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('fanini-token') : null;
      const userStr = typeof window !== 'undefined' ? localStorage.getItem('fanini-user') : null;

      if (!token || !userStr) {
        set({ user: null, isLoading: false });
        return;
      }

      // Token im apiClient setzen
      apiClient.setAuthToken(token);

      // Parse user data
      const user = JSON.parse(userStr) as AuthUser;
      set({ user, isLoading: false });
    } catch (error) {
      console.error('Auth check failed:', error);

      // Clear invalid data
      if (typeof window !== 'undefined') {
        localStorage.removeItem('fanini-token');
        localStorage.removeItem('fanini-user');
      }

      // Clear token im apiClient
      apiClient.setAuthToken(null);

      set({ user: null, isLoading: false });
    }
  },

  setUser: user => {
    set({ user });

    // User in localStorage speichern
    if (user && typeof window !== 'undefined') {
      localStorage.setItem('fanini-user', JSON.stringify(user));
    }
  },

  login: async credentials => {
    // API Call
    const response = await apiClient.post<{
      token: string;
      user: AuthUser;
    }>('/api/auth/login', credentials);

    // Token im apiClient setzen
    apiClient.setAuthToken(response.token);

    // Token und User in localStorage speichern
    if (typeof window !== 'undefined') {
      localStorage.setItem('fanini-token', response.token);
      localStorage.setItem('fanini-user', JSON.stringify(response.user));
    }

    // State updaten
    set({ user: response.user, isLoading: false });
  },

  logout: () => {
    // Token im apiClient löschen
    apiClient.setAuthToken(null);

    // LocalStorage aufräumen
    if (typeof window !== 'undefined') {
      localStorage.removeItem('fanini-token');
      localStorage.removeItem('fanini-refresh');
      localStorage.removeItem('fanini-user');
    }

    // State zurücksetzen
    set({ user: null });

    // Redirect
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  },
}));

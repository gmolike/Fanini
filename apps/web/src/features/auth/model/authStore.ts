// apps/web/src/features/auth/model/authStore.ts
import { create } from 'zustand';

import type { AuthUser } from './types';

type AuthState = {
  user: AuthUser | null;
  isLoading: boolean;
  checkAuth: () => void;
  setUser: (user: AuthUser | null) => void;
  logout: () => void;
};

/**
 * Globaler Auth Store
 * Verwaltet User-Session und Token
 */
export const useAuthStore = create<AuthState>((set: (state: Partial<AuthState>) => void) => ({
  user: null,
  isLoading: true,

  checkAuth: () => {
    try {
      const token = localStorage.getItem('fanini-token');
      const userStr = localStorage.getItem('fanini-user');

      if (!token || !userStr) {
        set({ user: null, isLoading: false });
        return;
      }

      // Parse user data
      const user = JSON.parse(userStr) as AuthUser;
      set({ user, isLoading: false });
    } catch (error: unknown) {
      // Log the error for debugging
      if (error instanceof Error) {
        console.error('Error during checkAuth:', error.message);
      } else if (typeof error === 'string') {
        console.error('Unknown error during checkAuth:', error);
      } else {
        console.error('Unknown error during checkAuth:', JSON.stringify(error));
      }
      // Clear invalid data
      localStorage.removeItem('fanini-token');
      localStorage.removeItem('fanini-user');
      set({ user: null, isLoading: false });
    }
  },

  setUser: (user: AuthUser | null) => {
    set({ user });
  },

  logout: () => {
    localStorage.removeItem('fanini-token');
    localStorage.removeItem('fanini-refresh');
    localStorage.removeItem('fanini-user');
    set({ user: null });
    window.location.href = '/login';
  },
}));

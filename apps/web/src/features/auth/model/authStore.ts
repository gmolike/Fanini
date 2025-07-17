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
      set({ user: null, isLoading: false });
    }
  },

  setUser: user => {
    set({ user });
  },

  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('fanini-token');
      localStorage.removeItem('fanini-refresh');
      localStorage.removeItem('fanini-user');
      window.location.href = '/login';
    }
    set({ user: null });
  },
}));

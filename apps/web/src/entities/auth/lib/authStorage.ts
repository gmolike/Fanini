// apps/web/src/entities/auth/lib/authStorage.ts
import { AUTH_STORAGE_KEYS, type AuthUser, type TokenPair } from '../model/types';

/**
 * Auth Storage Manager
 * @description Verwaltet Auth-Daten im LocalStorage
 */
export const authStorage = {
  /**
   * Tokens
   */
  getAccessToken: (): string | null => {
    return localStorage.getItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN);
  },

  getRefreshToken: (): string | null => {
    return localStorage.getItem(AUTH_STORAGE_KEYS.REFRESH_TOKEN);
  },

  setTokens: (tokens: TokenPair): void => {
    localStorage.setItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN, tokens.accessToken);
    localStorage.setItem(AUTH_STORAGE_KEYS.REFRESH_TOKEN, tokens.refreshToken);
  },

  /**
   * User
   */
  getUser: (): AuthUser | null => {
    const userString = localStorage.getItem(AUTH_STORAGE_KEYS.USER);
    if (!userString) return null;

    try {
      return JSON.parse(userString) as AuthUser;
    } catch {
      return null;
    }
  },

  setUser: (user: AuthUser): void => {
    localStorage.setItem(AUTH_STORAGE_KEYS.USER, JSON.stringify(user));
  },

  /**
   * Clear all
   */
  clear: (): void => {
    localStorage.removeItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(AUTH_STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(AUTH_STORAGE_KEYS.USER);
  },

  /**
   * Check if authenticated
   */
  isAuthenticated: (): boolean => {
    return !!authStorage.getAccessToken();
  },
};

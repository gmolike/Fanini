// apps/web/src/features/auth/api/authApi.ts
import type { AuthResponse, LoginCredentials } from '../model/types';

const API_BASE = process.env['NEXT_PUBLIC_API_URL'] ?? 'http://localhost:3000/api';

/**
 * Authentifizierung mit Backend
 */
export const loginWithCredentials = async (
  credentials: LoginCredentials
): Promise<AuthResponse> => {
  const response = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  const data = (await response.json()) as { success: boolean; data?: AuthResponse; error?: string };

  if (!response.ok || !data.success) {
    throw new Error(data.error ?? 'Login fehlgeschlagen');
  }

  if (!data.data) {
    throw new Error('Keine Daten in der Antwort');
  }

  return data.data;
};

/**
 * Token refresh
 */
export const refreshAccessToken = async (
  refreshToken: string
): Promise<{ accessToken: string; refreshToken: string }> => {
  const response = await fetch(`${API_BASE}/auth/refresh`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ refreshToken }),
  });

  const data = (await response.json()) as {
    success: boolean;
    data?: { accessToken: string; refreshToken: string };
    error?: string;
  };

  if (!response.ok || !data.success) {
    throw new Error(data.error ?? 'Token refresh fehlgeschlagen');
  }

  if (!data.data) {
    throw new Error('Keine Daten in der Antwort');
  }

  return data.data;
};

/**
 * Logout
 */
export const logout = async (): Promise<void> => {
  const token = localStorage.getItem('fanini-token');

  if (token) {
    await fetch(`${API_BASE}/auth/logout`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // Clear local storage
  localStorage.removeItem('fanini-token');
  localStorage.removeItem('fanini-refresh');
  localStorage.removeItem('fanini-user');
};

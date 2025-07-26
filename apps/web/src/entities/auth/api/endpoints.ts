/* eslint-disable sonarjs/no-hardcoded-passwords */
// apps/web/src/entities/auth/api/endpoints.ts
/**
 * Auth API Endpoints
 * @description Alle authentifizierungs-bezogenen API Endpoints
 */
export const AUTH_ENDPOINTS = {
  login: '/api/auth/login',
  register: '/api/auth/register',
  refresh: '/api/auth/refresh',
  logout: '/api/auth/logout',
  verify: (token: string) => `/api/auth/verify/${token}`,
  forgotPassword: '/api/auth/forgot-password',
  resetPassword: '/api/auth/reset-password',
} as const;

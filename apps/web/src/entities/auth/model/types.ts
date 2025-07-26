// apps/web/src/entities/auth/model/types.ts
import type {
  loginResponseDataSchema,
  loginSchema,
  refreshResponseDataSchema,
  refreshSchema,
  registerResponseDataSchema,
  registerSchema,
} from './schemas';
import type { z } from 'zod';

// Request Types
export type LoginRequest = z.infer<typeof loginSchema>;
export type RegisterRequest = z.infer<typeof registerSchema>;
export type RefreshRequest = z.infer<typeof refreshSchema>;

// Response Data Types (das was im result Feld kommt)
export type LoginResponse = z.infer<typeof loginResponseDataSchema>;
export type RegisterResponse = z.infer<typeof registerResponseDataSchema>;
export type RefreshResponse = z.infer<typeof refreshResponseDataSchema>;

// Domain Types
export type AuthUser = {
  id: string;
  email: string;
  vorname: string;
  nachname: string;
  rollen: UserRole[];
};

export type UserRole = {
  id: string;
  name: string;
  berechtigungen: string[];
};

export type TokenPair = {
  accessToken: string;
  refreshToken: string;
};

// Constants
export const AUTH_STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USER: 'user',
} as const;

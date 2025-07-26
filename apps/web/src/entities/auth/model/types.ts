// apps/web/src/entities/auth/model/types.ts
import type {
  loginResponseSchema,
  loginSchema,
  refreshResponseSchema,
  refreshSchema,
  registerResponseSchema,
  registerSchema,
} from './schemas';
import type { z } from 'zod';

// Request Types
export type LoginRequest = z.infer<typeof loginSchema>;
export type RegisterRequest = z.infer<typeof registerSchema>;
export type RefreshRequest = z.infer<typeof refreshSchema>;

// Response Types
export type LoginResponse = z.infer<typeof loginResponseSchema>;
export type RegisterResponse = z.infer<typeof registerResponseSchema>;
export type RefreshResponse = z.infer<typeof refreshResponseSchema>;

// User Types
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

// Token Types
export type TokenPair = {
  accessToken: string;
  refreshToken: string;
};

// Session Types
export type AuthSession = {
  user: AuthUser;
  tokens: TokenPair;
  expiresAt: string;
};

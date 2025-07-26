// apps/web/src/entities/auth/model/schemas.ts
import { z } from 'zod';

// Request Schemas
export const loginSchema = z.object({
  email: z.string().email('Ungültige E-Mail-Adresse'),
  password: z.string().min(6, 'Passwort muss mindestens 6 Zeichen lang sein'),
});

export const registerSchema = z.object({
  email: z.string().email('Ungültige E-Mail-Adresse'),
  password: z.string().min(6, 'Passwort muss mindestens 6 Zeichen lang sein'),
  vorname: z.string().min(2, 'Vorname muss mindestens 2 Zeichen lang sein'),
  nachname: z.string().min(2, 'Nachname muss mindestens 2 Zeichen lang sein'),
  telefon: z.string().optional(),
});

export const refreshSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh Token erforderlich'),
});

export const logoutSchema = z.object({
  refreshToken: z.string().optional(),
});

// User Role Schema
const userRoleSchema = z.object({
  id: z.string(),
  name: z.string(),
  berechtigungen: z.array(z.string()),
});

// Auth User Schema
const authUserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  vorname: z.string(),
  nachname: z.string(),
  rollen: z.array(userRoleSchema),
});

// Response Schemas
export const loginResponseSchema = z.object({
  success: z.literal(true),
  result: z.object({
    accessToken: z.string(),
    refreshToken: z.string(),
    user: authUserSchema,
  }),
  timestamp: z.string(),
});

export const registerResponseSchema = z.object({
  success: z.literal(true),
  result: z.object({
    message: z.string(),
  }),
  timestamp: z.string(),
});

export const refreshResponseSchema = z.object({
  success: z.literal(true),
  result: z.object({
    accessToken: z.string(),
    refreshToken: z.string(),
  }),
  timestamp: z.string(),
});

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

// Response Data Schemas (das was im result Feld kommt)
export const loginResponseDataSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
  user: authUserSchema,
});

export const registerResponseDataSchema = z.object({
  message: z.string(),
});

export const refreshResponseDataSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
});

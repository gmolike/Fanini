// frontend/src/shared/config/env.ts
// Type-safe environment variable access

import { z } from 'zod';

/**
 * Environment Variables Schema
 */
const envSchema = z.object({
  // Mode
  MODE: z.enum(['development', 'production', 'test']),
  DEV: z.boolean(),
  PROD: z.boolean(),

  // API
  VITE_API_BASE_URL: z.string().url().default('http://localhost:3000/api'),
  VITE_API_TIMEOUT: z.string().transform(Number).default('30000'),
  VITE_MOCK_API_ENABLED: z
    .string()
    .transform(val => val === 'true')
    .default('false'),

  // External Services
  VITE_GOOGLE_DRIVE_CLIENT_ID: z.string().optional(),
  VITE_EASYVEREIN_CLIENT_ID: z.string().optional(),
  VITE_EASYVEREIN_REDIRECT_URI: z.string().url().optional(),

  // Features
  VITE_ENABLE_DARK_MODE: z
    .string()
    .transform(val => val === 'true')
    .default('true'),
  VITE_ENABLE_PWA: z
    .string()
    .transform(val => val === 'true')
    .default('false'),
  VITE_ENABLE_ANALYTICS: z
    .string()
    .transform(val => val === 'true')
    .default('false'),

  // Assets
  VITE_CDN_URL: z.string().url().optional(),
  VITE_DEFAULT_AVATAR_URL: z.string().default('/images/default-avatar.jpg'),
});

/**
 * Validierte Environment Variables
 */
export const env = envSchema.parse(import.meta.env);

/**
 * Feature Flags Helper
 */
export const features = {
  darkMode: env.VITE_ENABLE_DARK_MODE,
  pwa: env.VITE_ENABLE_PWA,
  analytics: env.VITE_ENABLE_ANALYTICS,
  mockApi: env.VITE_MOCK_API_ENABLED,
} as const;

// Type Export
export type Env = z.infer<typeof envSchema>;

// frontend/src/entities/settings/model/schemas.ts
// Zod schemas for settings

import { z } from 'zod';

/**
 * Color Schema mit Hex-Validierung
 */
const hexColorSchema = z.string().regex(/^#[0-9A-F]{6}$/i, 'Ungültiges Hex-Format');

/**
 * Branding Schema - alle Felder required
 */
export const brandingSchema = z.object({
  colors: z.object({
    primary: hexColorSchema,
    secondary: hexColorSchema,
    accent: hexColorSchema.optional(), // Nur accent ist optional
  }),
  logo: z.object({
    url: z.string().url('Ungültige URL'),
    alt: z.string().min(1, 'Alt-Text erforderlich'),
  }),
});

/**
 * Contact Schema - alle Felder required außer phone
 */
export const contactSchema = z.object({
  email: z.string().email('Ungültige E-Mail'),
  phone: z.string().optional(), // Nur phone ist optional
  address: z.object({
    street: z.string(),
    zip: z.string().regex(/^\d{5}$/, 'PLZ muss 5 Ziffern haben'),
    city: z.string(),
  }),
});

/**
 * Feature Flags Schema - alle required
 */
export const featuresSchema = z.object({
  events: z.boolean(),
  members: z.boolean(),
  gallery: z.boolean(),
});

/**
 * Main Settings Schema - alle Felder required
 */
export const settingsSchema = z.object({
  id: z.string(),
  branding: brandingSchema,
  contact: contactSchema,
  features: featuresSchema,
  updatedAt: z.string(),
});

/**
 * Settings Update Schema - hier können Felder optional sein
 */
export const settingsUpdateSchema = z.object({
  branding: brandingSchema.partial().optional(), // partial macht alle Unterfelder optional
  contact: contactSchema.partial().optional(),
  features: featuresSchema.partial().optional(),
});

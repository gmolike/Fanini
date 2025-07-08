// frontend/src/entities/settings/model/schemas.ts
import { z } from 'zod';

/**
 * Color Schema mit Hex-Validierung
 */
const hexColorSchema = z.string().regex(/^#[0-9A-F]{6}$/i, 'Ungültiges Hex-Format');

/**
 * Branding Schema
 */
export const brandingSchema = z.object({
  colors: z.object({
    primary: hexColorSchema,
    secondary: hexColorSchema,
    accent: hexColorSchema.optional(),
  }),
  logo: z.object({
    url: z.string().min(1), // Flexibler als .url()
    alt: z.string().min(1, 'Alt-Text erforderlich'),
  }),
});

/**
 * Contact Schema
 */
export const contactSchema = z.object({
  email: z.string().email('Ungültige E-Mail'),
  phone: z.string().optional(),
  address: z.object({
    street: z.string().min(1),
    zip: z.string().length(5, 'PLZ muss 5 Ziffern haben'),
    city: z.string().min(1),
  }),
});

/**
 * Feature Flags Schema
 */
export const featuresSchema = z.object({
  events: z.boolean(),
  members: z.boolean(),
  gallery: z.boolean(),
});

/**
 * Main Settings Schema
 */
export const settingsSchema = z.object({
  id: z.string(),
  branding: brandingSchema,
  contact: contactSchema,
  features: featuresSchema,
  updatedAt: z.string(),
});

/**
 * Settings Update Schema - partial updates
 */
export const settingsUpdateSchema = settingsSchema.partial().omit({ id: true, updatedAt: true });

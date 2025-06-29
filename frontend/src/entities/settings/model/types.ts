// frontend/src/entities/settings/model/types.ts
// TypeScript types derived from schemas

import { type z } from 'zod';

import {
  type settingsSchema,
  type settingsUpdateSchema,
  type brandingSchema,
  type contactSchema,
  type featuresSchema,
} from './schemas';

// Direkt von Schemas ableiten
export type Settings = z.infer<typeof settingsSchema>;
export type SettingsUpdate = z.infer<typeof settingsUpdateSchema>;
export type Branding = z.infer<typeof brandingSchema>;
export type Contact = z.infer<typeof contactSchema>;
export type Features = z.infer<typeof featuresSchema>;

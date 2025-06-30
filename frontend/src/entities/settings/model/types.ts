// frontend/src/entities/settings/model/types.ts
// TypeScript types derived from schemas

import { type z } from 'zod';

import {
  type brandingSchema,
  type contactSchema,
  type featuresSchema,
  type settingsSchema,
  type settingsUpdateSchema,
} from './schemas';


export type Branding = z.infer<typeof brandingSchema>;

export type Contact = z.infer<typeof contactSchema>;

export type Features = z.infer<typeof featuresSchema>;
// Direkt von Schemas ableiten
export type Settings = z.infer<typeof settingsSchema>;
export type SettingsUpdate = z.infer<typeof settingsUpdateSchema>;

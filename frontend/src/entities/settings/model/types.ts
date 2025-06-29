// frontend/src/entities/settings/model/types.ts
// TypeScript types derived from schemas

import { z } from 'zod';
import {
  settingsSchema,
  settingsUpdateSchema,
  brandingSchema,
  contactSchema,
  featuresSchema,
} from './schemas';

// Direkt von Schemas ableiten
export type Settings = z.infer<typeof settingsSchema>;
export type SettingsUpdate = z.infer<typeof settingsUpdateSchema>;
export type Branding = z.infer<typeof brandingSchema>;
export type Contact = z.infer<typeof contactSchema>;
export type Features = z.infer<typeof featuresSchema>;

// frontend/src/entities/settings/api/mutations.ts
import { createRemoteMutation } from '@/shared/api/mutations';

import { brandingSchema,settingsSchema } from '../model/schemas';

import type { Branding,Settings, SettingsUpdate } from '../model/types';


/**
 * Update Branding Mutation
 */
export const useUpdateBranding = createRemoteMutation<Branding, Branding>({
  method: 'PATCH',
  endpoint: '/api/settings/branding',
  schema: brandingSchema,
  invalidateQueries: [['settings'], ['settings', 'branding']],
});


/**
 * Update Settings Mutation
 */
export const useUpdateSettings = createRemoteMutation<Settings, SettingsUpdate>({
  method: 'PUT',
  endpoint: '/api/settings',
  schema: settingsSchema,
  invalidateQueries: [['settings']],
});

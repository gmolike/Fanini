// frontend/src/entities/settings/api/queries.ts
import { createSimpleRemoteQuery } from '@shared/api';

import { settingsSchema, brandingSchema } from '../model/schemas';

import type { Settings, Branding } from '../model/types';

/**
 * Settings Queries
 */
export const useSettings = createSimpleRemoteQuery<Settings>({
  queryKey: ['settings'],
  endpoint: '/api/settings',
  schema: settingsSchema,
  staleTime: 1000 * 60 * 30, // 30 Minuten
  refetchOnWindowFocus: false,
});

export const useBranding = createSimpleRemoteQuery<Branding>({
  queryKey: ['settings', 'branding'],
  endpoint: '/api/settings/branding',
  schema: brandingSchema,
  staleTime: 1000 * 60 * 60, // 1 Stunde
  refetchOnWindowFocus: false,
});

// frontend/src/entities/settings/api/settingsApi.ts
// Settings API endpoints

import { apiClient } from '@/shared/api';
import { settingsSchema, brandingSchema } from '../model/schemas';
import type { Settings, SettingsUpdate, Branding } from '../model/types';

/**
 * Lädt die aktuellen Settings
 */
export const fetchSettings = async (): Promise<Settings> => {
  const response = await apiClient.get<unknown>('settings'); // OHNE führenden /
  return settingsSchema.parse(response);
};
/**
 * Aktualisiert die Settings
 */
export const updateSettings = async (data: SettingsUpdate): Promise<Settings> => {
  const response = await apiClient.put<unknown>('/settings', data);
  return settingsSchema.parse(response);
};

/**
 * Lädt nur das Branding
 */
export const fetchBranding = async (): Promise<Branding> => {
  const response = await apiClient.get<unknown>('settings/branding'); // OHNE führenden /
  return brandingSchema.parse(response);
};

/**
 * Aktualisiert nur das Branding
 */
export const updateBranding = async (data: Branding): Promise<Branding> => {
  const response = await apiClient.patch<unknown>('/settings/branding', data);
  return brandingSchema.parse(response);
};

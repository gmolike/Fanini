// frontend/src/entities/settings/api/settingsHooks.ts
// React Query hooks for settings

import { createQueryKeys } from '@/shared/api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as api from './settingsApi';

// Query Keys
export const settingsQueryKeys = createQueryKeys('settings');

/**
 * Hook zum Laden der Settings
 */
export const useSettings = () => {
  return useQuery({
    queryKey: settingsQueryKeys.all,
    queryFn: api.fetchSettings,
    staleTime: 1000 * 60 * 30, // 30 Minuten
  });
};

/**
 * Hook zum Aktualisieren der Settings
 */
export const useUpdateSettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.updateSettings,
    onSuccess: data => {
      queryClient.setQueryData(settingsQueryKeys.all, data);
    },
  });
};

/**
 * Hook zum Laden des Brandings
 */
export const useBranding = () => {
  return useQuery({
    queryKey: settingsQueryKeys.by('type', 'branding'),
    queryFn: api.fetchBranding,
    staleTime: 1000 * 60 * 60, // 1 Stunde
  });
};

/**
 * Hook zum Aktualisieren des Brandings
 */
export const useUpdateBranding = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.updateBranding,
    onSuccess: data => {
      queryClient.setQueryData(settingsQueryKeys.by('type', 'branding'), data);
      // Invalidate main settings
      queryClient.invalidateQueries({ queryKey: settingsQueryKeys.all });
    },
  });
};

// apps/web/src/app/providers/ApiProvider.tsx
import { useEffect } from 'react';

import { toast } from 'sonner';

import { apiClient } from '@/shared/api';

/**
 * API Provider
 * @description Konfiguriert globale API Interceptors mit Sonner Toast
 */
export const ApiProvider = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    // Request Interceptor für Loading State
    apiClient.addRequestInterceptor(config => {
      console.log('[API] Request:', config.method, config);
      return config;
    });

    // Response Interceptor für globales Error Handling
    apiClient.addResponseInterceptor(response => {
      if (!response.ok && response.status >= 500) {
        toast.error('Serverfehler', {
          description: 'Ein unerwarteter Fehler ist aufgetreten',
        });
      }
      return response;
    });
  }, []);

  return <>{children}</>;
};

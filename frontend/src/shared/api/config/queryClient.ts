// frontend/src/shared/api/config/queryClient.ts
// TanStack Query client configuration

import { QueryClient } from '@tanstack/react-query';

/**
 * Globaler Query Client für TanStack Query
 * @description Konfiguriert mit sinnvollen Defaults für die Faninitiative App
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Daten bleiben 5 Minuten frisch
      staleTime: 1000 * 60 * 5,
      // Cache wird nach 10 Minuten gelöscht
      gcTime: 1000 * 60 * 10,
      // Retry-Logik
      retry: (failureCount, error: any) => {
        // Bei 4xx Fehlern nicht wiederholen
        if (error?.status >= 400 && error?.status < 500) return false;
        // Maximal 3 Versuche
        return failureCount < 3;
      },
      // Kein automatisches Refetch beim Fokus (kann überschrieben werden)
      refetchOnWindowFocus: false,
      // Network-Status tracking aktivieren
      networkMode: 'online',
    },
    mutations: {
      // Mutations nur einmal wiederholen
      retry: 1,
      // Optimistic updates standardmäßig deaktiviert
      networkMode: 'online',
    },
  },
});

// Development-only: Query Client Logging
if (import.meta.env.DEV) {
  queryClient.getQueryCache().subscribe(event => {
    if (event.type === 'observerResultsUpdated') {
      console.debug('[Query]', event.query.queryKey, event.query.state.status);
    }
  });
}

// frontend/src/shared/api/queries/createRemoteQuery.ts
import {
  type QueryKey,
  useQuery,
  type UseQueryOptions,
  type UseQueryResult,
} from '@tanstack/react-query';
import { type z, ZodError } from 'zod';

import { apiClient, ApiClientError } from '../client';

export function createRemoteQuery<TData, TParams = void>(
  config: RemoteQueryConfig<TData, TParams>
) {
  return function useRemoteQuery(
    params: TParams,
    options?: Omit<UseQueryOptions<TData, Error, TData>, 'queryKey' | 'queryFn'>
  ): UseQueryResult<TData> {
    const queryKey =
      typeof config.queryKey === 'function' ? config.queryKey(params) : config.queryKey;

    const endpoint =
      typeof config.endpoint === 'function' ? config.endpoint(params) : config.endpoint;

    const enabled =
      typeof config.enabled === 'function' ? config.enabled(params) : (config.enabled ?? true);

    return useQuery<TData, Error, TData>({
      queryKey,
      queryFn: async () => {
        try {
          const response = await apiClient.get<unknown>(endpoint);

          if (config.schema) {
            try {
              return config.schema.parse(response);
            } catch (error) {
              if (error instanceof ZodError) {
                const details = error.errors
                  .map(e => `${e.path.join('.')}: ${e.message}`)
                  .join('\n');

                console.error('[RemoteQuery] Validation failed:', {
                  endpoint,
                  errors: error.errors,
                  received: response,
                });

                throw new Error(`Datenvalidierung fehlgeschlagen:\n${details}`);
              }
              throw error;
            }
          }

          return response as TData;
        } catch (error) {
          if (error instanceof ApiClientError) {
            throw new Error(`API Fehler (${String(error.statusCode)}): ${error.message}`);
          }
          if (error instanceof Error) {
            throw error;
          }
          throw new Error('Unbekannter Fehler beim Laden der Daten');
        }
      },
      ...(config.staleTime !== undefined ? { staleTime: config.staleTime } : {}),
      ...(config.gcTime !== undefined ? { gcTime: config.gcTime } : {}),
      ...(config.refetchOnWindowFocus !== undefined
        ? { refetchOnWindowFocus: config.refetchOnWindowFocus }
        : {}),
      enabled,
      retry: (failureCount, error) => {
        if (error instanceof Error && error.message.includes('Datenvalidierung')) {
          return false;
        }
        return failureCount < 3;
      },
      ...options,
    });
  };
}

export function createSimpleRemoteQuery<TData>(
  config: Omit<RemoteQueryConfig<TData>, 'enabled'> & {
    enabled?: boolean;
  }
) {
  return function useSimpleRemoteQuery(
    options?: Omit<UseQueryOptions<TData, Error, TData>, 'queryKey' | 'queryFn'>
  ): UseQueryResult<TData> {
    // Erstelle die parametrisierte Version
    const useParametrizedQuery = createRemoteQuery<TData>({
      ...config,
      enabled: () => config.enabled ?? true,
    });

    // Rufe sie mit undefined auf (da keine Parameter benötigt werden)
    return useParametrizedQuery(undefined, options);
  };
}

// Vereinfachte Version ohne Parameter
export type RemoteQueryConfig<TData, TParams = void> = {
  queryKey: QueryKey | ((params: TParams) => QueryKey);
  endpoint: string | ((params: TParams) => string);
  schema?: z.ZodSchema<TData>;
  staleTime?: number;
  gcTime?: number;
  refetchOnWindowFocus?: boolean;
  enabled?: boolean | ((params: TParams) => boolean);
}

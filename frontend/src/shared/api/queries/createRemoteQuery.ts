// frontend/src/shared/api/queries/createRemoteQuery.ts
import {
  type QueryKey,
  useQuery,
  type UseQueryOptions,
  type UseQueryResult,
} from '@tanstack/react-query';
import { type z, ZodError } from 'zod';

import { apiClient, ApiClientError } from '../client';

// Constants
const DEFAULT_RETRY_COUNT = 3;
const DEFAULT_ENABLED = true;

// Types
type QueryKeyFactory<TParams> = (params: TParams) => QueryKey;
type EndpointFactory<TParams> = (params: TParams) => string;
type EnabledFactory<TParams> = (params: TParams) => boolean;

/**
 * Configuration für Remote Queries
 * @template TData - Der Typ der zurückgegebenen Daten
 * @template TParams - Der Typ der Parameter (default: void)
 */
export type RemoteQueryConfig<TData, TParams = void> = {
  /** Query Key für React Query Cache */
  queryKey: QueryKey | QueryKeyFactory<TParams>;
  /** API Endpoint URL */
  endpoint: string | EndpointFactory<TParams>;
  /** Zod Schema für Response Validierung */
  schema?: z.ZodSchema<TData>;
  /** Zeit in ms, wie lange Daten als "fresh" gelten */
  staleTime?: number;
  /** Zeit in ms, wie lange Daten im Cache bleiben */
  gcTime?: number;
  /** Ob Query bei Window Focus neu geladen werden soll */
  refetchOnWindowFocus?: boolean;
  /** Ob Query aktiviert ist */
  enabled?: boolean | EnabledFactory<TParams>;
};

/**
 * Simple Query Config ohne Parameter
 */
export type SimpleRemoteQueryConfig<TData> = Omit<RemoteQueryConfig<TData>, 'enabled'> & {
  enabled?: boolean;
};

/**
 * Custom Error für Validierungsfehler
 */
class ValidationError extends Error {
  constructor(
    message: string,
    public readonly endpoint: string,
    public readonly errors: z.ZodError['errors']
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}

/**
 * Erstellt einen parametrisierten Remote Query Hook
 * @template TData - Der Typ der zurückgegebenen Daten
 * @template TParams - Der Typ der Parameter
 * @param config - Query Konfiguration
 * @returns Hook Funktion für die Query
 *
 * @example
 * ```typescript
 * const useUserQuery = createRemoteQuery<User, { id: string }>({
 *   queryKey: ({ id }) => ['user', id],
 *   endpoint: ({ id }) => `/api/users/${id}`,
 *   schema: userSchema,
 * });
 *
 * // Verwendung:
 * const { data } = useUserQuery({ id: '123' });
 * ```
 */
export function createRemoteQuery<TData, TParams = void>(
  config: RemoteQueryConfig<TData, TParams>
) {
  return function useRemoteQuery(
    params: TParams,
    options?: Omit<UseQueryOptions<TData, Error, TData>, 'queryKey' | 'queryFn'>
  ): UseQueryResult<TData> {
    // Resolve dynamic values
    const queryKey = resolveConfigValue(config.queryKey, params);
    const endpoint = resolveConfigValue(config.endpoint, params);
    const enabled = resolveConfigValue(config.enabled, params) ?? DEFAULT_ENABLED;

    return useQuery<TData, Error, TData>({
      queryKey,
      queryFn: async () => fetchAndValidate<TData>(endpoint, config.schema),
      enabled,
      retry: createRetryHandler(),
      staleTime: config.staleTime,
      gcTime: config.gcTime,
      refetchOnWindowFocus: config.refetchOnWindowFocus,
      ...options,
    });
  };
}

/**
 * Erstellt einen einfachen Remote Query Hook ohne Parameter
 * @template TData - Der Typ der zurückgegebenen Daten
 * @param config - Query Konfiguration
 * @returns Hook Funktion für die Query
 *
 * @example
 * ```typescript
 * const useSettingsQuery = createSimpleRemoteQuery<Settings>({
 *   queryKey: ['settings'],
 *   endpoint: '/api/settings',
 *   schema: settingsSchema,
 * });
 *
 * // Verwendung:
 * const { data } = useSettingsQuery();
 * ```
 */
export function createSimpleRemoteQuery<TData>(config: SimpleRemoteQueryConfig<TData>) {
  // Konvertiere zu parametrisierter Version mit void params
  const parameterizedConfig: RemoteQueryConfig<TData> = {
    ...config,
    enabled: () => config.enabled ?? DEFAULT_ENABLED,
  };

  const useParametrizedQuery = createRemoteQuery<TData>(parameterizedConfig);

  return function useSimpleRemoteQuery(
    options?: Omit<UseQueryOptions<TData, Error, TData>, 'queryKey' | 'queryFn'>
  ): UseQueryResult<TData> {
    return useParametrizedQuery(undefined, options);
  };
}

/**
 * Hilfsfunktion zum Auflösen von statischen oder dynamischen Config-Werten
 */
function resolveConfigValue<TValue, TParams>(
  value: TValue | ((params: TParams) => TValue) | undefined,
  params: TParams
): TValue | undefined {
  if (typeof value === 'function') {
    return (value as (params: TParams) => TValue)(params);
  }
  return value;
}

/**
 * Fetcht Daten vom Endpoint und validiert sie mit dem Schema
 */
async function fetchAndValidate<TData>(
  endpoint: string,
  schema?: z.ZodSchema<TData>
): Promise<TData> {
  try {
    const response = await apiClient.get<unknown>(endpoint);

    if (!schema) {
      return response as TData;
    }

    return validateResponse(response, schema, endpoint);
  } catch (error) {
    throw handleFetchError(error, endpoint);
  }
}

/**
 * Validiert die API Response gegen das Schema
 */
function validateResponse<TData>(
  response: unknown,
  schema: z.ZodSchema<TData>,
  endpoint: string
): TData {
  try {
    return schema.parse(response);
  } catch (error) {
    if (error instanceof ZodError) {
      console.error('[RemoteQuery] Validation failed:', {
        endpoint,
        errors: error.errors,
        received: response,
      });

      const details = error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join('\n');

      throw new ValidationError(
        `Datenvalidierung fehlgeschlagen:\n${details}`,
        endpoint,
        error.errors
      );
    }
    throw error;
  }
}

/**
 * Behandelt Fetch-Fehler und konvertiert sie in aussagekräftige Fehlermeldungen
 */
function handleFetchError(error: unknown, endpoint: string): Error {
  if (error instanceof ApiClientError) {
    return new Error(`API Fehler (${String(error.statusCode)}): ${error.message}`);
  }

  if (error instanceof ValidationError || error instanceof Error) {
    return error;
  }

  console.error('[RemoteQuery] Unbekannter Fehler:', { endpoint, error });
  return new Error('Unbekannter Fehler beim Laden der Daten');
}

/**
 * Erstellt einen Retry-Handler für die Query
 */
function createRetryHandler() {
  return (failureCount: number, error: Error): boolean => {
    // Keine Wiederholung bei Validierungsfehlern
    if (error instanceof ValidationError) {
      return false;
    }

    // Maximal 3 Versuche
    return failureCount < DEFAULT_RETRY_COUNT;
  };
}

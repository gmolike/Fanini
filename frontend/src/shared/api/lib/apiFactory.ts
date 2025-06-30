// frontend/src/shared/api/lib/apiFactory.ts
// Generic API helper functions

import { z } from 'zod';

import { apiClient } from '../config/apiClient';

/**
 * API Endpoint Konfiguration
 */
export const createApiEndpoint = <TParams = void, TResponse = unknown>(
  config: ApiEndpointConfig<TParams, TResponse>
) => {
  return async (params: TParams): Promise<TResponse> => {
    const url = typeof config.url === 'function' ? config.url(params) : config.url;

    let response: unknown;

    switch (config.method) {
      case 'GET':
        response = await apiClient.get(url);
        break;
      case 'POST':
        response = await apiClient.post(url, params);
        break;
      case 'PUT':
        response = await apiClient.put(url, params);
        break;
      case 'DELETE':
        response = await apiClient.delete(url);
        break;
      case 'PATCH':
        response = await apiClient.patch(url, params);
        break;
    }

    // Transform response if needed
    if (config.transformResponse) {
      response = config.transformResponse(response);
    }

    // Validate with Zod if schema provided
    if (config.schema) {
      try {
        return config.schema.parse(response);
      } catch (error) {
        if (error instanceof z.ZodError) {
          console.error('Response validation failed:', error.errors);
          throw new Error('Invalid response format');
        }
        throw error;
      }
    }

    return response as TResponse;
  };
};

/**
 * Erstellt eine typsichere API-Funktion
 * @param config - Endpoint-Konfiguration
 */
export const createBatchOperation = <TParams, TResponse>(
  endpoint: (params: TParams) => Promise<TResponse>,
  options?: {
    batchSize?: number;
    delay?: number;
  }
) => {
  const { batchSize = 5, delay = 100 } = options ?? {};

  return async (items: TParams[]): Promise<TResponse[]> => {
    const results: TResponse[] = [];

    for (let i = 0; i < items.length; i += batchSize) {
      const batch = items.slice(i, i + batchSize);
      const batchResults = await Promise.all(batch.map(endpoint));
      results.push(...batchResults);

      // Delay zwischen Batches
      if (i + batchSize < items.length && delay > 0) {
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    return results;
  };
};

/**
 * Erstellt Batch-Operationen
 * @param endpoint - API Endpoint Funktion
 * @param options - Batch Optionen
 */
export type ApiEndpointConfig<TParams = void, TResponse = unknown> = {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  url: string | ((params: TParams) => string);
  schema?: z.ZodSchema<TResponse>;
  transformResponse?: (data: unknown) => TResponse;
}

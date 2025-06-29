// frontend/src/shared/api/client/types.ts
import type { z } from 'zod';

/**
 * Generic API Response Wrapper
 */
export interface ApiResponse<T> {
  data: T;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

/**
 * API Endpoint Configuration
 */
export interface ApiEndpointConfig<TParams = void, TResponse = unknown> {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  endpoint: string | ((params: TParams) => string);
  schema?: z.ZodSchema<TResponse>;
}

/**
 * Pagination Parameters
 */
export interface PaginationParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

/**
 * Standard Query Parameters
 */
export interface QueryParams extends PaginationParams {
  search?: string;
  filters?: Record<string, any>;
}

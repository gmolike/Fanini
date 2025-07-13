// frontend/src/shared/api/client/types.ts
import type { z } from 'zod';


/**
 * API Endpoint Configuration
 */
export type ApiEndpointConfig<TParams = void, TResponse = unknown> = {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  endpoint: string | ((params: TParams) => string);
  schema?: z.ZodSchema<TResponse>;
};


/**
 * Generic API Response Wrapper
 */
export type ApiResponse<T> = {
  data: T;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
};

/**
 * Pagination Parameters
 */
export type PaginationParams = {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
};

/**
 * Standard Query Parameters
 */
export type QueryParams = {
  search?: string;
  filters?: Record<string, unknown>;
} & PaginationParams;

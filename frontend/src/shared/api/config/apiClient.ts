// frontend/src/shared/api/config/apiClient.ts
import { z } from 'zod';


/**
 * Custom API Error Klasse
 */
export const apiClient = new ApiClient();



/**
 * Request Options Type
 */
export { ApiClient };




export class ApiClientError extends Error implements ApiError {
  code: string | undefined;
  statusCode: number;
  details: Record<string, unknown> | undefined;

  constructor(error: ApiError) {
    super(error.message);
    this.name = 'ApiClientError';
    this.code = error.code;
    this.statusCode = error.statusCode;
    this.details = error.details;
  }
}


/**
 * API Error Schema
 */
export const apiErrorSchema = z.object({
  message: z.string(),
  code: z.string().optional(),
  statusCode: z.number(),
  details: z.record(z.unknown()).optional(),
});

/**
 * API Client Klasse
 * @description Wrapper um fetch mit TypeScript und Error Handling
 */
class ApiClient {
  private readonly baseURL: string;
  private readonly timeout: number;
  private defaultHeaders: Record<string, string>;

  constructor() {
    // Validate environment variables
    const baseURL = import.meta.env['VITE_API_BASE_URL'] as string | undefined;
    if (!baseURL && import.meta.env['VITE_MOCK_API_ENABLED'] !== 'true') {
      throw new Error('VITE_API_BASE_URL is not defined');
    }

    this.baseURL = baseURL ?? '';
    this.timeout = Number(import.meta.env['VITE_API_TIMEOUT']) || 30000;
    this.defaultHeaders = {
      contentType: 'application/json',
      accept: 'application/json',
    };
  }

  /**
   * Setzt den Auth Token
   */
  setAuthToken(token: string | null): void {
    if (token) {
      this.defaultHeaders['Authorization'] = `Bearer ${token}`;
    } else {
      delete this.defaultHeaders['Authorization'];
    }
  }

  /**
   * Erstellt die volle URL
   */
  private getFullUrl(endpoint: string): string {
    // Stelle sicher, dass endpoint mit / beginnt
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

    // Für MSW - immer relative URLs verwenden
    if (import.meta.env['VITE_MOCK_API_ENABLED'] === 'true') {
      return `/api${cleanEndpoint}`;
    }

    // Für Production API - stelle sicher, dass baseURL kein trailing slash hat
    const cleanBaseURL = this.baseURL.endsWith('/') ? this.baseURL.slice(0, -1) : this.baseURL;

    return `${cleanBaseURL}${cleanEndpoint}`;
  }

  /**
   * Merge Headers
   */
  private mergeHeaders(customHeaders?: HeadersInit): Headers {
    // Map camelCase keys to standard HTTP header keys
    const headerKeyMap: Record<string, string> = {
      contentType: 'Content-Type',
      accept: 'Accept',
      authorization: 'Authorization',
    };

    const headers = new Headers();
    Object.entries(this.defaultHeaders).forEach(([key, value]) => {
      const mappedKey = headerKeyMap[key] ?? key;
      headers.set(mappedKey, value);
    });

    if (customHeaders) {
      if (customHeaders instanceof Headers) {
        customHeaders.forEach((value, key) => {
          headers.set(key, value);
        });
      } else if (Array.isArray(customHeaders)) {
        customHeaders.forEach(([key, value]) => {
          headers.set(key, value);
        });
      } else {
        Object.entries(customHeaders).forEach(([key, value]) => {
          headers.set(key, value);
        });
      }
    }

    return headers;
  }

  /**
   * Wrapper für fetch mit Timeout
   */
  private async fetchWithTimeout(url: string, options: RequestInit = {}): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, this.timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: this.mergeHeaders(options.headers),
      });

      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new ApiClientError({
            message: `Request timeout after ${this.timeout.toString()}ms`,
            statusCode: 408,
            code: 'TIMEOUT',
          });
        }

        // Network error
        throw new ApiClientError({
          message: error.message || 'Network error',
          statusCode: 0,
          code: 'NETWORK_ERROR',
        });
      }

      throw error;
    }
  }

  /**
   * Verarbeitet die Response
   */
  private async handleResponse<T>(response: Response): Promise<T> {
    // Handle successful responses
    if (response.ok) {
      // 204 No Content
      if (response.status === 204) {
        return {} as T;
      }

      try {
        return (await response.json()) as T;
      } catch {
        // Response ist kein JSON
        return {} as T;
      }
    }

    // Handle error responses
    let errorData: Partial<ApiError>;

    try {
      errorData = (await response.json()) as Partial<ApiError>;
    } catch {
      errorData = {
        message: response.statusText || 'Ein Fehler ist aufgetreten',
        statusCode: response.status,
      };
    }

    const apiError: ApiError = {
      message: errorData.message ?? 'Ein Fehler ist aufgetreten',
      code: errorData.code,
      statusCode: response.status,
      details: errorData.details,
    };

    throw new ApiClientError(apiError);
  }

  /**
   * Build URL with params
   */
  private buildUrl(endpoint: string, params?: Record<string, string | number | boolean>): string {
    const url = new URL(this.getFullUrl(endpoint), window.location.origin);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, String(value));
      });
    }

    return url.toString();
  }

  /**
   * GET Request
   */
  async get<T = unknown>(endpoint: string, options?: RequestOptions): Promise<T> {
    const { params, ...fetchOptions } = options ?? {};
    const url = this.buildUrl(endpoint, params);

    const response = await this.fetchWithTimeout(url, {
      ...fetchOptions,
      method: 'GET',
    });

    return this.handleResponse<T>(response);
  }

  /**
   * POST Request
   */
  async post<T = unknown>(endpoint: string, data?: unknown, options?: RequestOptions): Promise<T> {
    const { params, ...fetchOptions } = options ?? {};
    const url = this.buildUrl(endpoint, params);

    const response = await this.fetchWithTimeout(url, {
      ...fetchOptions,
      method: 'POST',
      body: data !== undefined ? JSON.stringify(data) : null,
    });

    return this.handleResponse<T>(response);
  }

  /**
   * PUT Request
   */
  async put<T = unknown>(endpoint: string, data?: unknown, options?: RequestOptions): Promise<T> {
    const { params, ...fetchOptions } = options ?? {};
    const url = this.buildUrl(endpoint, params);

    const response = await this.fetchWithTimeout(url, {
      ...fetchOptions,
      method: 'PUT',
      body: data !== undefined ? JSON.stringify(data) : null,
    });

    return this.handleResponse<T>(response);
  }

  /**
   * PATCH Request
   */
  async patch<T = unknown>(endpoint: string, data?: unknown, options?: RequestOptions): Promise<T> {
    const { params, ...fetchOptions } = options ?? {};
    const url = this.buildUrl(endpoint, params);

    const response = await this.fetchWithTimeout(url, {
      ...fetchOptions,
      method: 'PATCH',
      body: data !== undefined ? JSON.stringify(data) : null,
    });

    return this.handleResponse<T>(response);
  }

  /**
   * DELETE Request
   */
  async delete<T = unknown>(endpoint: string, options?: RequestOptions): Promise<T> {
    const { params, ...fetchOptions } = options ?? {};
    const url = this.buildUrl(endpoint, params);

    const response = await this.fetchWithTimeout(url, {
      ...fetchOptions,
      method: 'DELETE',
    });

    return this.handleResponse<T>(response);
  }

  /**
   * Upload File
   */
  async upload<T = unknown>(
    endpoint: string,
    formData: FormData,
    options?: RequestOptions
  ): Promise<T> {
    const { params, headers, ...fetchOptions } = options ?? {};
    const url = this.buildUrl(endpoint, params);

    // Remove Content-Type for FormData (browser will set it)
    const uploadHeaders = this.mergeHeaders(headers);
    uploadHeaders.delete('Content-Type');

    const response = await this.fetchWithTimeout(url, {
      ...fetchOptions,
      method: 'POST',
      body: formData,
      headers: uploadHeaders,
    });

    return this.handleResponse<T>(response);
  }
}

// Singleton Instance
export type ApiError = z.infer<typeof apiErrorSchema>;

// Export für Tests oder spezielle Use Cases
export type RequestOptions = {
  params?: Record<string, string | number | boolean>;
} & Omit<RequestInit, 'body' | 'method'>;

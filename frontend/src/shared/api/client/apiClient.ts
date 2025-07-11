// frontend/src/shared/api/client/apiClient.ts
import { z } from 'zod';

/**
 * API Error Schema
 */
const apiErrorSchema = z.object({
  message: z.string(),
  code: z.string().optional(),
  statusCode: z.number(),
  details: z.record(z.unknown()).optional(),
});

/**
 * Custom API Error Class
 */
export class ApiClient {
  private readonly baseURL: string;
  private readonly defaultTimeout: number;
  private defaultHeaders: Record<string, string>;

  constructor() {
    // WICHTIG: Für MSW keine base URL!
    this.baseURL =
      String(import.meta.env['VITE_MOCK_API_ENABLED']) === 'true'
        ? '' // Leer für MSW!
        : String(import.meta.env['VITE_API_BASE_URL'] ?? '');
    this.defaultTimeout = Number(import.meta.env['VITE_API_TIMEOUT'] ?? 30000);
    this.defaultHeaders = {
      contentType: 'application/json',
    };
  }

  /**
   * Setzt den Auth Token
   */
  setAuthToken(token: string | null) {
    if (token) {
      this.defaultHeaders['Authorization'] = `Bearer ${token}`;
    } else {
      delete this.defaultHeaders['Authorization'];
    }
  }

  /**
   * Konstruiert die vollständige URL
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private buildUrl(endpoint: string, params?: Record<string, any>): string {
    // Stelle sicher, dass endpoint mit / beginnt
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

    // Für MSW: Direkt den endpoint zurückgeben
    if (import.meta.env['VITE_MOCK_API_ENABLED'] === 'true') {
      const url = new URL(cleanEndpoint, window.location.origin);

      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            url.searchParams.append(key, String(value));
          }
        });
      }

      return url.pathname + url.search;
    }

    // Production: Mit base URL
    const url = new URL(this.baseURL + cleanEndpoint);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    return url.toString();
  }

  /**
   * Zentrale Request-Methode
   */
  private async request<T>(endpoint: string, config: ApiRequestConfig = {}): Promise<T> {
    const { params, timeout = this.defaultTimeout, body, ...fetchConfig } = config;

    // URL bauen
    const url = this.buildUrl(endpoint, params);

    // Timeout handling
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, timeout);

    try {
      const response = await fetch(url, {
        ...fetchConfig,
        signal: controller.signal,
        headers: {
          ...this.defaultHeaders,
          ...(fetchConfig.headers &&
          !(fetchConfig.headers instanceof Headers) &&
          typeof fetchConfig.headers === 'object' &&
          !Array.isArray(fetchConfig.headers)
            ? fetchConfig.headers
            : {}),
        },
        body: body !== undefined ? JSON.stringify(body) : null,
      });

      clearTimeout(timeoutId);

      // Error handling
      if (!response.ok) {
        const errorText = await response.text();
        let errorData: ApiError;

        try {
          errorData = apiErrorSchema.parse(JSON.parse(errorText));
        } catch {
          errorData = {
            message: errorText || response.statusText,
            statusCode: response.status,
          };
        }

        throw new ApiClientError(errorData.statusCode, errorData.code, errorData.details);
      }

      // 204 No Content
      if (response.status === 204) {
        return {} as T;
      }

      // Parse JSON
      const data = (await response.json()) as unknown;
      return data as T;
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof Error && error.name === 'AbortError') {
        throw new ApiClientError(408, 'TIMEOUT', { timeout });
      }

      throw error;
    }
  }

  /**
   * GET Request
   */
  async get<T>(endpoint: string, config?: Omit<ApiRequestConfig, 'body'>): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'GET' });
  }

  /**
   * POST Request
   */
  async post<T>(endpoint: string, data?: unknown, config?: ApiRequestConfig): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'POST', body: data });
  }

  /**
   * PUT Request
   */
  async put<T>(endpoint: string, data?: unknown, config?: ApiRequestConfig): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'PUT', body: data });
  }

  /**
   * PATCH Request
   */
  async patch<T>(endpoint: string, data?: unknown, config?: ApiRequestConfig): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'PATCH', body: data });
  }

  /**
   * DELETE Request
   */
  async delete<T>(endpoint: string, config?: Omit<ApiRequestConfig, 'body'>): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'DELETE' });
  }
}


/**
 * API Request Configuration
 */
export const apiClient = new ApiClient();


export class ApiClientError extends Error {
  constructor(
    public statusCode: number,
    public code?: string,
    public details?: Record<string, unknown>
  ) {
    super(`API Error: ${statusCode.toString()}`);
    this.name = 'ApiClientError';
  }
}

/**
 * API Client Class
 */
export type ApiError = z.infer<typeof apiErrorSchema>;

// Singleton Instance
export type ApiRequestConfig = {
  params?: Record<string, unknown>;
  timeout?: number;
  body?: unknown;
} & Omit<RequestInit, 'body'>;

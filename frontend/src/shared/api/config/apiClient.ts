// frontend/src/shared/api/config/apiClient.ts
// Axios/Fetch client setup

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

export type ApiError = z.infer<typeof apiErrorSchema>;

/**
 * API Client Klasse
 * @description Wrapper um fetch mit TypeScript und Error Handling
 */
class ApiClient {
  private readonly baseURL: string;
  private readonly timeout: number;
  private headers: Record<string, string>;

  constructor() {
    this.baseURL = import.meta.env.VITE_API_BASE_URL ?? '';
    this.timeout = Number(import.meta.env.VITE_API_TIMEOUT) || 30000;
    this.headers = {
      'Content-Type': 'application/json',
    };
  }

  /**
   * Setzt den Auth Token
   */
  setAuthToken(token: string | null) {
    if (token) {
      this.headers['Authorization'] = `Bearer ${token}`;
    } else {
      delete this.headers['Authorization'];
    }
  }

  /**
   * Erstellt die volle URL
   */
  private getFullUrl(endpoint: string): string {
    // Stelle sicher, dass endpoint mit / beginnt
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

    // Für MSW - immer relative URLs verwenden
    if (import.meta.env.VITE_MOCK_API_ENABLED === 'true') {
      return `/api${cleanEndpoint}`;
    }

    // Für Production API
    return `${this.baseURL}${cleanEndpoint}`;
  }

  /**
   * Wrapper für fetch mit Timeout
   */
  private async fetchWithTimeout(url: string, options: RequestInit = {}): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => { controller.abort(); }, this.timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          ...this.headers,
          ...options.headers,
        },
      });
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error(`Request timeout after ${this.timeout}ms`);
      }
      throw error;
    }
  }

  /**
   * Verarbeitet die Response
   */
  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        message: response.statusText,
        statusCode: response.status,
      }));

      const apiError: ApiError = {
        message: errorData.message ?? 'Ein Fehler ist aufgetreten',
        code: errorData.code,
        statusCode: response.status,
        details: errorData.details,
      };

      throw apiError;
    }

    // 204 No Content
    if (response.status === 204) {
      return {} as T;
    }

    return response.json();
  }

  /**
   * GET Request
   */
  async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    const url = new URL(this.getFullUrl(endpoint));

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    const response = await this.fetchWithTimeout(url.toString(), {
      method: 'GET',
    });

    return this.handleResponse<T>(response);
  }

  /**
   * POST Request
   */
  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    const response = await this.fetchWithTimeout(this.getFullUrl(endpoint), {
      method: 'POST',
      body: data ? JSON.stringify(data) : null,
    });

    return this.handleResponse<T>(response);
  }

  /**
   * PUT Request
   */
  async put<T>(endpoint: string, data?: unknown): Promise<T> {
    const response = await this.fetchWithTimeout(this.getFullUrl(endpoint), {
      method: 'PUT',
      body: data ? JSON.stringify(data) : null,
    });

    return this.handleResponse<T>(response);
  }

  /**
   * DELETE Request
   */
  async delete<T>(endpoint: string): Promise<T> {
    const response = await this.fetchWithTimeout(this.getFullUrl(endpoint), {
      method: 'DELETE',
    });

    return this.handleResponse<T>(response);
  }

  /**
   * PATCH Request
   */
  async patch<T>(endpoint: string, data?: unknown): Promise<T> {
    const response = await this.fetchWithTimeout(this.getFullUrl(endpoint), {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : null,
    });

    return this.handleResponse<T>(response);
  }
}

// Singleton Instance
export const apiClient = new ApiClient();

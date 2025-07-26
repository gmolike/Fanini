// apps/web/src/shared/api/client/apiClient.ts

import { API_CONFIG } from '@/shared/api/config/constants';
import type { ApiError, ApiResponse } from '@/shared/api/types/response';

/**
 * Custom API Error Class
 * @description Erweiterte Error-Klasse für API-Fehler mit strukturierten Daten
 */
export class ApiClientError extends Error {
  code: string;
  statusCode: number;
  details?: Record<string, unknown>;
  requestId?: string;

  constructor(error: ApiError, requestId?: string) {
    super(error.message);
    this.name = 'ApiClientError';
    this.code = error.code;
    this.statusCode = error.statusCode;
    this.details = error.details;
    this.requestId = requestId;
  }
}

/**
 * Request Options Type
 * @description Optionen für API-Requests
 */
export type RequestOptions = {
  /** Query Parameters */
  params?: Record<string, string | number | boolean>;
  /** Custom Headers */
  headers?: HeadersInit;
  /** AbortSignal für Request-Abbruch */
  signal?: AbortSignal;
};

/**
 * API Client Class
 * @description Zentrale Klasse für alle API-Kommunikation mit Response-Wrapper-Handling
 */
class ApiClient {
  private authToken: string | null = null;
  private readonly requestInterceptors: ((config: RequestInit) => RequestInit)[] = [];
  private readonly responseInterceptors: ((response: Response) => Response)[] = [];

  constructor() {
    // Token aus localStorage laden falls vorhanden
    if (typeof window !== 'undefined') {
      this.authToken = localStorage.getItem('access_token');
    }
  }

  /**
   * Setzt den Auth Token
   * @param token - JWT Token oder null zum Löschen
   */
  setAuthToken(token: string | null): void {
    this.authToken = token;
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('access_token', token);
      } else {
        localStorage.removeItem('access_token');
      }
    }
  }

  /**
   * Fügt einen Request Interceptor hinzu
   * @param interceptor - Interceptor Funktion
   */
  addRequestInterceptor(interceptor: (config: RequestInit) => RequestInit): void {
    this.requestInterceptors.push(interceptor);
  }

  /**
   * Fügt einen Response Interceptor hinzu
   * @param interceptor - Interceptor Funktion
   */
  addResponseInterceptor(interceptor: (response: Response) => Response): void {
    this.responseInterceptors.push(interceptor);
  }

  /**
   * Erstellt die Headers für den Request
   * @param customHeaders - Zusätzliche Headers
   * @returns Headers Objekt
   */
  private createHeaders(customHeaders?: HeadersInit): Headers {
    const headers = new Headers(API_CONFIG.headers);

    if (this.authToken) {
      headers.set('Authorization', `Bearer ${this.authToken}`);
    }

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
   * Baut die URL mit Query Parameters
   * @param endpoint - API Endpoint
   * @param params - Query Parameters
   * @returns Vollständige URL
   */
  private buildUrl(endpoint: string, params?: Record<string, string | number | boolean>): string {
    // Stelle sicher, dass endpoint mit / beginnt
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

    // Für relative URLs (Entwicklung mit Vite Proxy)
    if (!API_CONFIG.baseURL) {
      const url = new URL(cleanEndpoint, window.location.origin);

      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          url.searchParams.append(key, String(value));
        });
      }

      return url.pathname + url.search;
    }

    // Für absolute URLs (Production)
    const baseURL = API_CONFIG.baseURL.endsWith('/')
      ? API_CONFIG.baseURL.slice(0, -1)
      : API_CONFIG.baseURL;
    const url = new URL(baseURL + cleanEndpoint);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, String(value));
      });
    }

    return url.toString();
  }

  /**
   * Parst die Response gemäß dem API Response Format
   * @param response - Fetch Response
   * @returns Parsed Response Data
   */
  private async parseResponse<T>(response: Response): Promise<ApiResponse<T>> {
    try {
      const contentType = response.headers.get('content-type');

      // 204 No Content
      if (response.status === 204) {
        return {
          success: true,
          result: {} as T,
          timestamp: new Date().toISOString(),
        };
      }

      if (contentType?.includes('application/json')) {
        const data = (await response.json()) as ApiResponse<T>;
        return data;
      }

      // Fallback für nicht-JSON Responses
      const text = await response.text();

      // Erstelle ein strukturiertes Response-Objekt für nicht-JSON Responses
      if (response.ok) {
        return {
          success: true,
          result: text as unknown as T,
          timestamp: new Date().toISOString(),
        };
      } else {
        return {
          success: false,
          error: {
            message: text || response.statusText || 'Ein Fehler ist aufgetreten',
            code: 'UNKNOWN_ERROR',
            statusCode: response.status,
          },
          timestamp: new Date().toISOString(),
        };
      }
    } catch (parseError) {
      // Log parse error in development
      if (import.meta.env.DEV) {
        console.error('[ApiClient] Failed to parse response:', parseError);
      }

      // Return error response
      return {
        success: false,
        error: {
          message: 'Response konnte nicht verarbeitet werden',
          code: 'PARSE_ERROR',
          statusCode: response.status,
          details: {
            parseError: parseError instanceof Error ? parseError.message : 'Unknown parse error',
          },
        },
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * Führt Request Interceptors aus
   * @param config - Request Konfiguration
   * @returns Modifizierte Konfiguration
   */
  private applyRequestInterceptors(config: RequestInit): RequestInit {
    return this.requestInterceptors.reduce((acc, interceptor) => interceptor(acc), config);
  }

  /**
   * Führt Response Interceptors aus
   * @param response - Fetch Response
   * @returns Modifizierte Response
   */
  private applyResponseInterceptors(response: Response): Response {
    return this.responseInterceptors.reduce((acc, interceptor) => interceptor(acc), response);
  }

  /**
   * Zentrale Request-Methode
   * @param method - HTTP Method
   * @param endpoint - API Endpoint
   * @param options - Request Optionen
   * @returns Promise mit Response-Daten
   */
  private async request<T>(
    method: string,
    endpoint: string,
    options?: RequestOptions & { body?: unknown }
  ): Promise<T> {
    const { params, headers, body, signal } = options ?? {};
    const url = this.buildUrl(endpoint, params);

    // Timeout handling
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, API_CONFIG.timeout);
    const combinedSignal = signal ?? controller.signal;

    try {
      let config: RequestInit = {
        method,
        headers: this.createHeaders(headers),
        signal: combinedSignal,
      };

      // Body nur bei Methoden die einen Body unterstützen
      if (body !== undefined && ['POST', 'PUT', 'PATCH'].includes(method)) {
        config.body = JSON.stringify(body);
      }

      // Request Interceptors anwenden
      config = this.applyRequestInterceptors(config);

      // Request ausführen
      let response = await fetch(url, config);

      clearTimeout(timeoutId);

      // Response Interceptors anwenden
      response = this.applyResponseInterceptors(response);

      // Parse Response gemäß API Format
      const apiResponse = await this.parseResponse<T>(response);

      // Handle Response basierend auf success flag
      if (apiResponse.success) {
        return apiResponse.result;
      } else {
        throw new ApiClientError(apiResponse.error, apiResponse.requestId);
      }
    } catch (error) {
      clearTimeout(timeoutId);

      // Bereits behandelte API Errors
      if (error instanceof ApiClientError) {
        throw error;
      }

      // Timeout Error
      if (error instanceof Error && error.name === 'AbortError') {
        throw new ApiClientError({
          message: 'Request timeout',
          statusCode: 408,
          code: 'TIMEOUT',
          details: { timeout: API_CONFIG.timeout },
        });
      }

      // Network Error
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        throw new ApiClientError({
          message: 'Netzwerkfehler - Bitte überprüfen Sie Ihre Internetverbindung',
          statusCode: 0,
          code: 'NETWORK_ERROR',
        });
      }

      // Unbekannter Fehler
      throw new ApiClientError({
        message: error instanceof Error ? error.message : 'Unbekannter Fehler',
        statusCode: 0,
        code: 'UNKNOWN_ERROR',
        details: { originalError: error },
      });
    }
  }

  /**
   * GET Request
   * @param endpoint - API Endpoint
   * @param options - Request Optionen
   * @returns Promise mit Response-Daten
   */
  async get<T = unknown>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>('GET', endpoint, options);
  }

  /**
   * POST Request
   * @param endpoint - API Endpoint
   * @param data - Request Body
   * @param options - Request Optionen
   * @returns Promise mit Response-Daten
   */
  async post<T = unknown>(endpoint: string, data?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>('POST', endpoint, { ...options, body: data });
  }

  /**
   * PUT Request
   * @param endpoint - API Endpoint
   * @param data - Request Body
   * @param options - Request Optionen
   * @returns Promise mit Response-Daten
   */
  async put<T = unknown>(endpoint: string, data?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>('PUT', endpoint, { ...options, body: data });
  }

  /**
   * PATCH Request
   * @param endpoint - API Endpoint
   * @param data - Request Body
   * @param options - Request Optionen
   * @returns Promise mit Response-Daten
   */
  async patch<T = unknown>(endpoint: string, data?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>('PATCH', endpoint, { ...options, body: data });
  }

  /**
   * DELETE Request
   * @param endpoint - API Endpoint
   * @param options - Request Optionen
   * @returns Promise mit Response-Daten
   */
  async delete<T = unknown>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>('DELETE', endpoint, options);
  }

  /**
   * File Upload
   * @param endpoint - API Endpoint
   * @param formData - FormData mit Dateien
   * @param options - Request Optionen
   * @returns Promise mit Response-Daten
   */
  async upload<T = unknown>(
    endpoint: string,
    formData: FormData,
    options?: RequestOptions
  ): Promise<T> {
    const { params, headers = {}, signal } = options ?? {};
    const url = this.buildUrl(endpoint, params);

    // Headers ohne Content-Type (wird automatisch gesetzt)
    const uploadHeaders = new Headers(headers);
    if (this.authToken) {
      uploadHeaders.set('Authorization', `Bearer ${this.authToken}`);
    }
    uploadHeaders.delete('Content-Type');

    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, API_CONFIG.timeout * 2); // Doppeltes Timeout für Uploads
    const combinedSignal = signal ?? controller.signal;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: uploadHeaders,
        body: formData,
        signal: combinedSignal,
      });

      clearTimeout(timeoutId);

      const apiResponse = await this.parseResponse<T>(response);

      if (apiResponse.success) {
        return apiResponse.result;
      } else {
        throw new ApiClientError(apiResponse.error, apiResponse.requestId);
      }
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof ApiClientError) {
        throw error;
      }

      throw new ApiClientError({
        message: 'Upload fehlgeschlagen',
        statusCode: 0,
        code: 'UPLOAD_ERROR',
        details: { originalError: error },
      });
    }
  }
}

// Singleton Instance
export const apiClient = new ApiClient();

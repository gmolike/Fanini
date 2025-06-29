/* eslint-disable @typescript-eslint/naming-convention */
// Basis API Konfiguration
export const apiConfig = {
  baseUrl: (import.meta.env['VITE_API_BASE_URL'] as string | undefined) ?? '/api',
  timeout: 30000,
} as const;

// Generischer Fetch Wrapper
export async function apiFetch(endpoint: string, options?: RequestInit): Promise<Response> {
  const url = `${apiConfig.baseUrl}${endpoint}`;

  let extraHeaders: Record<string, string> = {};
  if (options?.headers) {
    if (Array.isArray(options.headers)) {
      extraHeaders = {};
    } else if (options.headers instanceof Headers) {
      extraHeaders = Object.fromEntries(options.headers.entries());
    } else {
      extraHeaders = options.headers;
    }
  }

  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...extraHeaders,
    },
    signal: AbortSignal.timeout(apiConfig.timeout),
  });

  if (!response.ok) {
    const error = new Error(`API Error: ${response.statusText}`);
    (error as Error & { status?: unknown }).status = response.status;
    throw error;
  }

  return response;
}

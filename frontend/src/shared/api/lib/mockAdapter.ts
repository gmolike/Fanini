// frontend/src/shared/api/lib/mockAdapter.ts
// MSW adapter wrapper

import { delay as mswDelay, HttpResponse, type DefaultBodyType } from 'msw';

/**
 * Berechnet realistische Delays für Mocks
 * @param min - Minimum delay in ms
 * @param max - Maximum delay in ms
 */
export const getMockDelay = (min = 100, max = 600): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Erstellt eine Mock Response mit realistischem Delay
 * @param data - Response data
 * @param options - Response options
 */
export const mockResponse = async <T extends DefaultBodyType>(
  data: T,
  options?: {
    status?: number;
    delay?: number;
    headers?: Record<string, string>;
  }
): Promise<HttpResponse<T>> => {
  // Realistisches Delay
  await mswDelay(options?.delay ?? getMockDelay());

  const responseInit: { status: number; headers?: Record<string, string> } = {
    status: options?.status ?? 200,
  };
  if (options?.headers) {
    responseInit.headers = options.headers;
  }
  return HttpResponse.json(data, responseInit);
};

/**
 * Mock Error Response Helper
 * @param message - Error message
 * @param statusCode - HTTP status code
 * @param code - Optional error code
 */
export const mockErrorResponse = async (
  message: string,
  statusCode = 400,
  code?: string
): Promise<HttpResponse<any>> => {
  await mswDelay(getMockDelay(50, 200));

  return HttpResponse.json(
    {
      message,
      statusCode,
      code,
      timestamp: new Date().toISOString(),
    },
    { status: statusCode }
  );
};

/**
 * Pagination Helper für Mocks
 * @param items - Alle Items
 * @param page - Aktuelle Seite (1-basiert)
 * @param limit - Items pro Seite
 */
export const paginateItems = <T>(
  items: T[],
  page = 1,
  limit = 10
): {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
} => {
  const start = (page - 1) * limit;
  const end = start + limit;

  return {
    data: items.slice(start, end),
    meta: {
      total: items.length,
      page,
      limit,
      totalPages: Math.ceil(items.length / limit),
    },
  };
};

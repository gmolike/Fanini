// frontend/src/testing/mocks/helpers/response.helpers.ts
import { delay,HttpResponse } from 'msw';

type ApiResponse<T> = {
  data: T;
  meta?: {
    total: number;
    page: number;
    limit: number;
  };
};

export const createApiResponse = async <T>(
  data: T,
  meta?: ApiResponse<T>['meta'],
  delayMs = 300
): Promise<HttpResponse<ApiResponse<T>>> => {
  await delay(delayMs);

  const response: ApiResponse<T> = { data };
  if (meta) {
    response.meta = meta;
  }

  return HttpResponse.json(response);
};

export const createErrorResponse = async (
  message: string,
  status = 404,
  delayMs = 200
): Promise<HttpResponse<{ error: string }>> => {
  await delay(delayMs);

  return HttpResponse.json({ error: message }, { status });
};

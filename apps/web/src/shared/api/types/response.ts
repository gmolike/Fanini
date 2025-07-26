// apps/web/src/shared/api/types/response.ts

export type ApiResponse<TData = unknown> = {
  success: boolean;
  timestamp: string;
  requestId?: string;
} & (
  | {
      success: true;
      result: TData;
      meta?: ResponseMeta;
    }
  | {
      success: false;
      error: ApiError;
      meta?: ResponseMeta;
    }
);

export type ApiError = {
  message: string;
  code: string;
  statusCode: number;
  details?: Record<string, any>;
  field?: string;
};

export type ResponseMeta = {
  version?: string;
  pagination?: PaginationMeta;
  performance?: {
    duration: number;
    queries?: number;
  };
  [key: string]: any;
};

export type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
};

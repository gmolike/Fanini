// apps/api/src/presentation/helpers/responses/types.ts

/**
 * Basis Response Type für alle API Responses
 */
export type ApiResponse<TData = unknown> = {
  /** Erfolgs-Flag */
  success: boolean;
  /** Response Timestamp */
  timestamp: string;
  /** Request ID für Debugging */
  requestId?: string;
} & (SuccessResponse<TData> | ErrorResponse);

/**
 * Success Response mit Daten
 */
type SuccessResponse<TData> = {
  success: true;
  /** Die eigentlichen Daten */
  result: TData;
  /** Metadaten (Pagination, etc.) */
  meta?: ResponseMeta;
  error?: never;
};

/**
 * Error Response mit strukturiertem Fehler
 */
type ErrorResponse = {
  success: false;
  result?: never;
  meta?: ResponseMeta;
  /** Strukturierter Fehler */
  error: ApiError;
};

/**
 * Strukturiertes Error-Objekt
 */
export type ApiError = {
  /** Fehlermeldung für Nutzer */
  message: string;
  /** Maschinenlesbarer Error Code */
  code: ErrorCode;
  /** HTTP Status Code */
  statusCode: number;
  /** Zusätzliche Details (z.B. Validierungsfehler) */
  details?: Record<string, any>;
  /** Stack Trace (nur in Development) */
  stack?: string;
  /** Betroffenes Feld/Resource */
  field?: string;
};

/**
 * Response Meta-Informationen
 */
export type ResponseMeta = {
  /** API Version */
  version?: string;
  /** Pagination */
  pagination?: PaginationMeta;
  /** Performance Metrics */
  performance?: {
    duration: number;
    queries?: number;
  };
  /** Zusätzliche Infos */
  [key: string]: any;
};

/**
 * Pagination Meta
 */
export type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
};

/**
 * Vordefinierte Error Codes
 */
export const ERROR_CODES = {
  // Validation
  VALIDATION_ERROR: "VALIDATION_ERROR",
  INVALID_INPUT: "INVALID_INPUT",
  MISSING_FIELD: "MISSING_FIELD",

  // Authentication
  UNAUTHORIZED: "UNAUTHORIZED",
  TOKEN_EXPIRED: "TOKEN_EXPIRED",
  INVALID_CREDENTIALS: "INVALID_CREDENTIALS",

  // Authorization
  FORBIDDEN: "FORBIDDEN",
  INSUFFICIENT_PERMISSIONS: "INSUFFICIENT_PERMISSIONS",

  // Resources
  NOT_FOUND: "NOT_FOUND",
  ALREADY_EXISTS: "ALREADY_EXISTS",
  CONFLICT: "CONFLICT",

  // Business Logic
  BUSINESS_RULE_VIOLATION: "BUSINESS_RULE_VIOLATION",
  INVALID_STATE: "INVALID_STATE",
  QUOTA_EXCEEDED: "QUOTA_EXCEEDED",

  // System
  INTERNAL_ERROR: "INTERNAL_ERROR",
  SERVICE_UNAVAILABLE: "SERVICE_UNAVAILABLE",
  DATABASE_ERROR: "DATABASE_ERROR",
  EXTERNAL_SERVICE_ERROR: "EXTERNAL_SERVICE_ERROR",
} as const;

export type ErrorCode = (typeof ERROR_CODES)[keyof typeof ERROR_CODES];

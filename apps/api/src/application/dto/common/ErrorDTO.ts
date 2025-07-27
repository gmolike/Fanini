// apps/api/src/application/dto/common/ErrorDTO.ts

/**
 * Standard Error DTO
 * @description Strukturierte Fehlerinformationen
 */
export type ErrorDTO = {
  /** Eindeutiger Fehlercode (z.B. "AUTH_001") */
  readonly code: string;

  /** Benutzerfreundliche Fehlermeldung */
  readonly message: string;

  /** Zusätzliche Details zum Fehler */
  readonly details?: ErrorDetails;

  /** Betroffenes Feld bei Validierungsfehlern */
  readonly field?: string;

  /** HTTP Status Code */
  readonly statusCode: number;
};

/**
 * Fehler-Details
 */
export type ErrorDetails = {
  /** Technische Fehlermeldung (nur in Development) */
  readonly technical?: string;

  /** Stack Trace (nur in Development) */
  readonly stack?: string;

  /** Validierungsfehler pro Feld */
  readonly validationErrors?: Record<string, string[]>;

  /** Kontext-Informationen */
  readonly context?: Record<string, any>;
};

/**
 * Error Code Kategorien
 */
export const ERROR_CODES = {
  // Authentication & Authorization
  AUTH_INVALID_CREDENTIALS: "AUTH_001",
  AUTH_TOKEN_EXPIRED: "AUTH_002",
  AUTH_TOKEN_INVALID: "AUTH_003",
  AUTH_INSUFFICIENT_PERMISSIONS: "AUTH_004",

  // Validation
  VALIDATION_FAILED: "VAL_001",
  VALIDATION_REQUIRED_FIELD: "VAL_002",
  VALIDATION_INVALID_FORMAT: "VAL_003",
  VALIDATION_OUT_OF_RANGE: "VAL_004",

  // Business Logic
  BUSINESS_RULE_VIOLATION: "BIZ_001",
  BUSINESS_APPROVAL_REQUIRED: "BIZ_002",
  BUSINESS_WORKFLOW_ERROR: "BIZ_003",
  BUSINESS_DUPLICATE_ENTRY: "BIZ_004",

  // Resources
  RESOURCE_NOT_FOUND: "RES_001",
  RESOURCE_ALREADY_EXISTS: "RES_002",
  RESOURCE_LOCKED: "RES_003",
  RESOURCE_DELETED: "RES_004",

  // System
  SYSTEM_INTERNAL_ERROR: "SYS_001",
  SYSTEM_SERVICE_UNAVAILABLE: "SYS_002",
  SYSTEM_DATABASE_ERROR: "SYS_003",
  SYSTEM_EXTERNAL_API_ERROR: "SYS_004",
} as const;

export type ErrorCode = typeof ERROR_CODES[keyof typeof ERROR_CODES];

/**
 * Factory Functions für häufige Fehler
 */
export const createValidationError = (
  field: string,
  message: string,
  validationErrors?: Record<string, string[]>
): ErrorDTO => ({
  code: ERROR_CODES.VALIDATION_FAILED,
  message,
  field,
  statusCode: 400,
  details: validationErrors ? { validationErrors } : undefined,
});

export const createNotFoundError = (
  resource: string,
  id?: string
): ErrorDTO => ({
  code: ERROR_CODES.RESOURCE_NOT_FOUND,
  message: `${resource} nicht gefunden`,
  statusCode: 404,
  details: id ? { context: { id, resource } } : undefined,
});

export const createPermissionError = (
  action: string,
  resource?: string
): ErrorDTO => ({
  code: ERROR_CODES.AUTH_INSUFFICIENT_PERMISSIONS,
  message: `Keine Berechtigung für: ${action}`,
  statusCode: 403,
  details: resource ? { context: { action, resource } } : undefined,
});

export const createBusinessError = (
  message: string,
  code: ErrorCode = ERROR_CODES.BUSINESS_RULE_VIOLATION,
  context?: Record<string, any>
): ErrorDTO => ({
  code,
  message,
  statusCode: 422,
  details: context ? { context } : undefined,
});

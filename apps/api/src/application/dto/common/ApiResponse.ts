// apps/api/src/application/dto/common/ApiResponse.ts

import { ErrorDTO } from "./ErrorDTO";
import { PaginationDTO } from "./PaginationDTO";

/**
 * Standard API Response Wrapper
 * @description Umschließt alle API-Antworten mit Metadaten
 * @template T - Der Typ der Daten in der Response
 */
export type ApiResponse<T> = {
  /** Erfolgsindikator */
  readonly success: boolean;

  /** Die eigentlichen Daten (optional bei Fehlern) */
  readonly data?: T;

  /** Fehlerinformationen (optional bei Erfolg) */
  readonly error?: ErrorDTO;

  /** Metadaten zur Response */
  readonly meta: ResponseMeta;
};

/**
 * Response Metadaten
 * @description Zusätzliche Informationen zur Response
 */
export type ResponseMeta = {
  /** ISO 8601 Timestamp */
  readonly timestamp: string;

  /** Eindeutige Request ID für Tracing */
  readonly requestId: string;

  /** API Version */
  readonly version: string;

  /** Pagination-Informationen (optional) */
  readonly pagination?: PaginationDTO;

  /** Performance-Metriken (optional) */
  readonly performance?: {
    readonly duration: number;
    readonly dbQueries?: number;
  };
};

/**
 * Erstellt eine Success Response
 */
export const createSuccessResponse = <T>(
  data: T,
  meta: Omit<ResponseMeta, "timestamp">
): ApiResponse<T> => ({
  success: true,
  data,
  meta: {
    ...meta,
    timestamp: new Date().toISOString(),
  },
});

/**
 * Erstellt eine Error Response
 */
export const createErrorResponse = (
  error: ErrorDTO,
  meta: Omit<ResponseMeta, "timestamp">
): ApiResponse<never> => ({
  success: false,
  error,
  meta: {
    ...meta,
    timestamp: new Date().toISOString(),
  },
});

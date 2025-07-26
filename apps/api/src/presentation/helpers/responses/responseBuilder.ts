// apps/api/src/presentation/helpers/responses/responseBuilder.ts

import { randomUUID } from "crypto";
import type {
  ApiResponse,
  ApiError,
  ErrorCode,
  ResponseMeta,
  PaginationMeta,
} from "./types";

/**
 * Response Builder für konsistente API Responses
 */
export class ResponseBuilder {
  private static readonly requestId = () => randomUUID();

  /**
   * Success Response
   */
  static success<TData>(data: TData, meta?: Partial<ResponseMeta>): Response {
    const body: ApiResponse<TData> = {
      success: true,
      result: data,
      timestamp: new Date().toISOString(),
      requestId: this.requestId(),
      meta: meta
        ? {
            version: process.env.API_VERSION || "1.0.0",
            ...meta,
          }
        : undefined,
    };

    return Response.json(body, { status: 200 });
  }

  /**
   * Paginated Success Response
   */
  static paginated<TData>(
    data: TData[],
    pagination: Omit<PaginationMeta, "totalPages" | "hasNext" | "hasPrev">,
    additionalMeta?: Partial<ResponseMeta>,
  ): Response {
    const totalPages = Math.ceil(pagination.total / pagination.limit);
    const paginationMeta: PaginationMeta = {
      ...pagination,
      totalPages,
      hasNext: pagination.page < totalPages,
      hasPrev: pagination.page > 1,
    };

    return this.success(data, {
      pagination: paginationMeta,
      ...additionalMeta,
    });
  }

  /**
   * Error Response
   */
  static error(
    message: string,
    code: ErrorCode,
    statusCode: number = 400,
    details?: Record<string, any>,
  ): Response {
    const error: ApiError = {
      message,
      code,
      statusCode,
      details,
      stack:
        process.env.NODE_ENV === "development" ? new Error().stack : undefined,
    };

    const body: ApiResponse = {
      success: false,
      error,
      timestamp: new Date().toISOString(),
      requestId: this.requestId(),
    };

    return Response.json(body, { status: statusCode });
  }

  /**
   * Validation Error Response
   */
  static validationError(errors: Record<string, string | string[]>): Response {
    return this.error("Validation failed", "VALIDATION_ERROR", 422, {
      fields: errors,
    });
  }

  /**
   * Not Found Response
   */
  static notFound(resource: string, id?: string): Response {
    const message = id
      ? `${resource} with id '${id}' not found`
      : `${resource} not found`;

    return this.error(message, "NOT_FOUND", 404);
  }

  /**
   * Unauthorized Response
   */
  static unauthorized(message: string = "Authentication required"): Response {
    return this.error(message, "UNAUTHORIZED", 401);
  }

  /**
   * Forbidden Response
   */
  static forbidden(message: string = "Insufficient permissions"): Response {
    return this.error(message, "FORBIDDEN", 403);
  }

  /**
   * Internal Server Error
   */
  static internalError(
    error: unknown,
    message: string = "An unexpected error occurred",
  ): Response {
    console.error("Internal error:", error);

    return this.error(
      message,
      "INTERNAL_ERROR",
      500,
      process.env.NODE_ENV === "development"
        ? { originalError: String(error) }
        : undefined,
    );
  }

  /**
   * Created Response (201)
   */
  static created<TData>(data: TData, location?: string): Response {
    const body: ApiResponse<TData> = {
      success: true,
      result: data,
      timestamp: new Date().toISOString(),
      requestId: this.requestId(),
    };

    // Erstelle Response mit Headers
    const response = Response.json(body, { status: 201 });

    // Füge Location Header hinzu, wenn vorhanden
    if (location && response.headers) {
      // In Next.js Route Handlers können wir Headers so setzen
      const headers = new Headers(response.headers);
      headers.set("Location", location);

      return new Response(JSON.stringify(body), {
        status: 201,
        headers,
      });
    }

    return response;
  }

  /**
   * No Content Response (204)
   */
  static noContent(): Response {
    return new Response(null, { status: 204 });
  }

  /**
   * Accepted Response (202)
   */
  static accepted<TData>(data?: TData, taskId?: string): Response {
    const body: ApiResponse<TData | { taskId: string }> = {
      success: true,
      result: data ?? { taskId: taskId || this.requestId() },
      timestamp: new Date().toISOString(),
      requestId: this.requestId(),
      meta: {
        status: "processing",
      },
    };

    return Response.json(body, { status: 202 });
  }

  /**
   * Conflict Response (409)
   */
  static conflict(message: string, details?: Record<string, any>): Response {
    return this.error(message, "CONFLICT", 409, details);
  }

  /**
   * Too Many Requests Response (429)
   */
  static tooManyRequests(
    message: string = "Too many requests",
    retryAfter?: number,
  ): Response {
    const response = this.error(message, "QUOTA_EXCEEDED", 429, {
      retryAfter,
    });

    if (retryAfter && response.headers) {
      const headers = new Headers(response.headers);
      headers.set("Retry-After", String(retryAfter));

      const body = {
        success: false,
        error: {
          message,
          code: "QUOTA_EXCEEDED" as ErrorCode,
          statusCode: 429,
          details: { retryAfter },
        },
        timestamp: new Date().toISOString(),
        requestId: this.requestId(),
      };

      return new Response(JSON.stringify(body), {
        status: 429,
        headers,
      });
    }

    return response;
  }
}

// Export convenience functions
export const {
  success,
  paginated,
  error,
  validationError,
  notFound,
  unauthorized,
  forbidden,
  internalError,
  created,
  noContent,
  accepted,
  conflict,
  tooManyRequests,
} = ResponseBuilder;

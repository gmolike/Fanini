// apps/api/src/presentation/helpers/responses/errorHandler.ts
import { ZodError } from "zod";
import {
  ResponseBuilder,
  validationError,
  notFound,
  forbidden,
  unauthorized,
  error,
  internalError,
} from "./responseBuilder";
import { ERROR_CODES } from "./types";

/**
 * Error Handler Wrapper für Controller
 * @description Wraps controller methods with comprehensive error handling
 */
export const withErrorHandling = <
  TArgs extends any[],
  TReturn extends Response,
>(
  handler: (...args: TArgs) => Promise<TReturn>,
) => {
  return async (...args: TArgs): Promise<Response> => {
    try {
      return await handler(...args);
    } catch (err) {
      // Zod Validation Errors
      if (err instanceof ZodError) {
        const fieldErrors = err.errors.reduce(
          (acc, zodError) => {
            const field = zodError.path.join(".");
            if (!acc[field]) {
              acc[field] = [];
            }
            (acc[field] as string[]).push(zodError.message);
            return acc;
          },
          {} as Record<string, string | string[]>,
        );

        return validationError(fieldErrors);
      }

      // Custom Business Errors mit Error Code
      if (err instanceof Error) {
        // Spezifische Fehlerbehandlung basierend auf Message
        if (
          err.message.toLowerCase().includes("nicht gefunden") ||
          err.message.toLowerCase().includes("not found")
        ) {
          return notFound("Resource");
        }

        if (
          err.message.toLowerCase().includes("berechtigung") ||
          err.message.toLowerCase().includes("permission")
        ) {
          return forbidden(err.message);
        }

        if (
          err.message.toLowerCase().includes("unauthorized") ||
          err.message.toLowerCase().includes("nicht autorisiert")
        ) {
          return unauthorized(err.message);
        }

        // Business Rule Violations
        if (
          err.message.toLowerCase().includes("bereits existiert") ||
          err.message.toLowerCase().includes("already exists")
        ) {
          return error(err.message, ERROR_CODES.RESOURCE_ALREADY_EXISTS, 409);
        }

        // Default Business Error
        return error(err.message, ERROR_CODES.BUSINESS_RULE_VIOLATION, 400);
      }

      // Unbekannte Errors
      return internalError(err);
    }
  };
};

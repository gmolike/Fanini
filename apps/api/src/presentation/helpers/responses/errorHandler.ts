// apps/api/src/presentation/helpers/responses/errorHandler.ts

import { ZodError } from 'zod';
import { ResponseBuilder } from './responseBuilder';

/**
 * Error Handler Wrapper für Controller
 */
export const withErrorHandling = <TArgs extends any[], TReturn extends Response>(
  handler: (...args: TArgs) => Promise<TReturn>
) => {
  return async (...args: TArgs): Promise<Response> => {
    try {
      return await handler(...args);
    } catch (error) {
      // Zod Validation Errors
      if (error instanceof ZodError) {
        const fieldErrors = error.errors.reduce((acc, err) => {
          const field = err.path.join('.');
          acc[field] = err.message;
          return acc;
        }, {} as Record<string, string>);

        return ResponseBuilder.validationError(fieldErrors);
      }

      // Custom Business Errors
      if (error instanceof Error) {
        // Check für spezifische Error Types
        if (error.message.includes('nicht gefunden')) {
          return ResponseBuilder.notFound('Resource');
        }
        if (error.message.includes('Berechtigung')) {
          return ResponseBuilder.forbidden(error.message);
        }

        // Default Error
        return ResponseBuilder.error(
          error.message,
          'BUSINESS_RULE_VIOLATION',
          400
        );
      }

      // Unbekannte Errors
      return ResponseBuilder.internalError(error);
    }
  };
};

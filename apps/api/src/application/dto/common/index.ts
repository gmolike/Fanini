// apps/api/src/application/dto/common/index.ts

export {
  type ApiResponse,
  type ResponseMeta,
  createSuccessResponse,
  createErrorResponse,
} from "./ApiResponse";

export {
  type ErrorDTO,
  type ErrorDetails,
  type ErrorCode,
  ERROR_CODES,
  createValidationError,
  createNotFoundError,
  createPermissionError,
  createBusinessError,
} from "./ErrorDTO";

export {
  type PaginationDTO,
  type PaginationParams,
  PAGINATION_DEFAULTS,
  createPaginationDTO,
  normalizePaginationParams,
  calculateOffset,
} from "./PaginationDTO";

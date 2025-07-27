// apps/api/src/application/dto/common/PaginationDTO.ts

/**
 * Pagination DTO
 * @description Informationen zur Seitennummerierung
 */
export type PaginationDTO = {
  /** Aktuelle Seite (1-basiert) */
  readonly page: number;

  /** Anzahl Einträge pro Seite */
  readonly pageSize: number;

  /** Gesamtanzahl der Einträge */
  readonly totalItems: number;

  /** Gesamtanzahl der Seiten */
  readonly totalPages: number;

  /** Gibt es eine nächste Seite? */
  readonly hasNext: boolean;

  /** Gibt es eine vorherige Seite? */
  readonly hasPrevious: boolean;
};

/**
 * Pagination Request Parameters
 */
export type PaginationParams = {
  /** Seite (1-basiert) */
  readonly page?: number;

  /** Einträge pro Seite */
  readonly pageSize?: number;

  /** Sortierfeld */
  readonly sortBy?: string;

  /** Sortierrichtung */
  readonly sortDirection?: "asc" | "desc";
};

/**
 * Default Pagination Werte
 */
export const PAGINATION_DEFAULTS = {
  PAGE: 1,
  PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
  SORT_DIRECTION: "asc" as const,
} as const;

/**
 * Erstellt Pagination DTO
 */
export const createPaginationDTO = (params: {
  page: number;
  pageSize: number;
  totalItems: number;
}): PaginationDTO => {
  const totalPages = Math.ceil(params.totalItems / params.pageSize);

  return {
    page: params.page,
    pageSize: params.pageSize,
    totalItems: params.totalItems,
    totalPages,
    hasNext: params.page < totalPages,
    hasPrevious: params.page > 1,
  };
};

/**
 * Validiert und normalisiert Pagination Parameters
 */
export const normalizePaginationParams = (
  params?: PaginationParams
): Required<Omit<PaginationParams, "sortBy">> => ({
  page: Math.max(1, params?.page || PAGINATION_DEFAULTS.PAGE),
  pageSize: Math.min(
    PAGINATION_DEFAULTS.MAX_PAGE_SIZE,
    Math.max(1, params?.pageSize || PAGINATION_DEFAULTS.PAGE_SIZE)
  ),
  sortDirection: params?.sortDirection || PAGINATION_DEFAULTS.SORT_DIRECTION,
});

/**
 * Berechnet Offset für Datenbank-Queries
 */
export const calculateOffset = (
  page: number,
  pageSize: number
): number => (page - 1) * pageSize;

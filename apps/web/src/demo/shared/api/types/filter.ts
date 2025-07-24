// apps/web/src/demo/shared/api/types/filter.ts
// Final location: apps/web/src/shared/api/types/filter.ts

/**
 * GlobalFilterRequest Type
 * @description Standard Request-Format für gefilterte Listen im Backend
 */
export type GlobalFilterRequest = {
  page: number;
  pageSize: number;
  searchTerm: string;
  sort: string[]; // ["name+asc", "createdAt+desc"]
};

/**
 * GlobalFilterResponse Type
 * @description Standard Response-Format für gefilterte Listen vom Backend
 */
export type GlobalFilterResponse<TData> = {
  page: number;
  pageSize: number;
  totalPages: number;
  totalElements: number;
  result: TData[];
};

/**
 * DataTable Filter State
 * @description Interner State für DataTable Filter
 */
export type DataTableFilterState = {
  page: number;
  pageSize: number;
  searchTerm: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
};

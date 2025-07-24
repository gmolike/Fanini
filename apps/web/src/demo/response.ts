// src/shared/api/types/response.ts

/**
 * GlobalFilterRequest Type
 * @description Request-Format für gefilterte Listen
 */
export type GlobalFilterRequest = {
  page: number;
  pageSize: number;
  searchTerm: string;
  sort: string[]; // ["name+asc", "createdAt+desc"]
};

/**
 * GlobalFilterResponse Type
 * @description Response-Format für gefilterte Listen
 */
export type GlobalFilterResponse<TData> = {
  page: number;
  pageSize: number;
  totalPages: number;
  totalElements: number;
  result: TData[];
};

// apps/web/src/demo/shared/hooks/useGlobalFilter.ts
// Final location: apps/web/src/shared/hooks/useGlobalFilter.ts

import { useQuery, type UseQueryOptions } from '@tanstack/react-query';

import { apiClient } from '@/shared/api';

import { toGlobalFilterRequest } from '../lib/converters/filterConverter';

import type { DataTableFilterState, GlobalFilterResponse } from '../api/types/filter';

/**
 * useGlobalFilter Hook Options
 * @description Konfiguration für den useGlobalFilter Hook
 */
type UseGlobalFilterOptions<TData> = {
  endpoint: string;
  queryKey: readonly unknown[];
  filters: DataTableFilterState;
  options?: Omit<UseQueryOptions<GlobalFilterResponse<TData>>, 'queryKey' | 'queryFn'>;
};

/**
 * useGlobalFilter Hook
 * @description Hook für API-Calls mit GlobalFilterRequest/Response Pattern
 * @template TData - Der Typ der Result-Items
 */
export const useGlobalFilter = <TData>({
  endpoint,
  queryKey,
  filters,
  options,
}: UseGlobalFilterOptions<TData>) => {
  const request = toGlobalFilterRequest(filters);

  return useQuery<GlobalFilterResponse<TData>>({
    queryKey: [...queryKey, request],
    queryFn: async () => {
      const params = new URLSearchParams();

      // Build query params
      params.append('page', String(request.page));
      params.append('pageSize', String(request.pageSize));
      if (request.searchTerm) {
        params.append('searchTerm', request.searchTerm);
      }
      request.sort.forEach(s => {
        params.append('sort', s);
      });

      return apiClient.get<GlobalFilterResponse<TData>>(`${endpoint}?${params.toString()}`);
    },
    ...options,
    placeholderData: previousData => previousData,
  });
};

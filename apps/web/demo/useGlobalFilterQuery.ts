// src/shared/hooks/useGlobalFilterQuery.ts
import { useMemo } from 'react';

import { useRemoteQuery } from '@/shared/api/query';
import { toBackendSort } from '@/shared/api/utils/sortUtils';

import type { GlobalFilterResponse } from '@/shared/api/types/response';
import type { UseQueryResult } from '@tanstack/react-query';

type UseGlobalFilterQueryOptions = {
  endpoint: string;
  filters: {
    page?: number;
    pageSize?: number;
    searchTerm?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  };
  queryKey: string[];
};

/**
 * useGlobalFilterQuery Hook
 * @description Hook für Endpoints mit GlobalFilterResponse
 * @template TData - Der Datentyp der Result-Items
 */
export function useGlobalFilterQuery<TData>({
  endpoint,
  filters,
  queryKey,
}: UseGlobalFilterQueryOptions): UseQueryResult<GlobalFilterResponse<TData>, Error> {
  // Build URL mit Backend-Format
  const url = useMemo(() => {
    const params = new URLSearchParams();

    params.append('page', String(filters.page ?? 0));
    params.append('pageSize', String(filters.pageSize ?? 20));
    params.append('searchTerm', filters.searchTerm || '');

    // Sort als Array
    const sortArray = toBackendSort(filters.sortBy, filters.sortOrder);
    sortArray.forEach(sort => params.append('sort', sort));

    return `${endpoint}?${params.toString()}`;
  }, [endpoint, filters]);

  return useRemoteQuery<GlobalFilterResponse<TData>>([...queryKey, filters], url, undefined, {
    keepPreviousData: true,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
}

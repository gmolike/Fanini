// src/shared/hooks/useGlobalFilterQuery.ts
import { useMemo } from 'react';

import { useRemoteQuery } from '@/shared/api/query';

import type { GlobalFilterResponse } from '@/shared/api/types/response';
import type { UseQueryResult } from '@tanstack/react-query';

type UseGlobalFilterQueryOptions = {
  endpoint: string;
  filters: {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  };
  queryKey: string[];
};

/**
 * useGlobalFilterQuery Hook
 * @description Generischer Hook für Endpoints mit GlobalFilterResponse
 * @template TData - Der Datentyp der Result-Items
 * @param options - Query Optionen
 * @returns Query Result mit GlobalFilterResponse<TData>
 */
export function useGlobalFilterQuery<TData>({
  endpoint,
  filters,
  queryKey,
}: UseGlobalFilterQueryOptions): UseQueryResult<GlobalFilterResponse<TData>> {
  // Build URL
  const url = useMemo(() => {
    const params = new URLSearchParams();

    params.append('page', String(filters.page ?? 0));
    params.append('limit', String(filters.limit ?? 20));
    params.append('search', filters.search || '');
    params.append('sortBy', filters.sortBy || 'createdAt');
    params.append('sortOrder', filters.sortOrder || 'desc');

    return `${endpoint}?${params.toString()}`;
  }, [endpoint, filters]);

  // Hier wird TData verwendet
  return useRemoteQuery<GlobalFilterResponse<TData>>([...queryKey, filters], url, undefined, {
    keepPreviousData: true,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
}

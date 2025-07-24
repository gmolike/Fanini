// apps/web/src/demo/shared/hooks/useFilterUrlState.ts
// Final location: apps/web/src/shared/hooks/useFilterUrlState.ts

import { useCallback, useMemo } from 'react';

import { useLocation } from '@tanstack/react-router';

import type { DataTableFilterState } from '../api/types/filter';

/**
 * Default Filter Values
 * @description Standard-Werte für Filter wenn keine URL-Parameter vorhanden
 */
const DEFAULT_FILTER_STATE: DataTableFilterState = {
  page: 0,
  pageSize: 20,
  searchTerm: '',
  sortBy: undefined,
  sortOrder: undefined,
};

/**
 * useFilterUrlState Hook
 * @description Synchronisiert Filter-State mit URL-Parametern
 * @param defaults - Optionale Standard-Werte
 * @returns [state, setState, resetState] Tuple
 */
export const useFilterUrlState = (
  defaults: Partial<DataTableFilterState> = {}
): readonly [
  DataTableFilterState,
  (updates: Partial<DataTableFilterState>) => void,
  () => void,
] => {
  const location = useLocation();
  const mergedDefaults = { ...DEFAULT_FILTER_STATE, ...defaults };

  // Parse State from URL
  const state = useMemo((): DataTableFilterState => {
    const searchParams = new URLSearchParams(location.search);

    return {
      page: Number(searchParams.get('page') ?? mergedDefaults.page),
      pageSize: Number(searchParams.get('pageSize') ?? mergedDefaults.pageSize),
      searchTerm: searchParams.get('search') ?? '',
      sortBy: searchParams.get('sortBy') ?? mergedDefaults.sortBy,
      sortOrder:
        (searchParams.get('sortOrder') as 'asc' | 'desc' | undefined) ?? mergedDefaults.sortOrder,
    };
  }, [location.search, mergedDefaults]);

  // Update State
  const setState = useCallback(
    (updates: Partial<DataTableFilterState>) => {
      const newState = { ...state, ...updates };
      const params = new URLSearchParams();

      // Build clean params
      if (newState.page !== mergedDefaults.page) {
        params.set('page', String(newState.page));
      }
      if (newState.pageSize !== mergedDefaults.pageSize) {
        params.set('pageSize', String(newState.pageSize));
      }
      if (newState.searchTerm) {
        params.set('search', newState.searchTerm);
      }
      if (newState.sortBy) {
        params.set('sortBy', newState.sortBy);
        if (newState.sortOrder) {
          params.set('sortOrder', newState.sortOrder);
        }
      }

      // Update URL using window.history
      const queryString = params.toString();
      const newUrl = window.location.pathname + (queryString ? `?${queryString}` : '');
      window.history.replaceState(null, '', newUrl);
    },
    [state, mergedDefaults]
  );

  // Reset to defaults
  const resetState = useCallback(() => {
    window.history.replaceState(null, '', window.location.pathname);
  }, []);

  return [state, setState, resetState] as const;
};

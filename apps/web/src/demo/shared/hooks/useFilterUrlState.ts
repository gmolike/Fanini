// apps/web/src/demo/shared/hooks/useFilterUrlState.ts
// Final location: apps/web/src/shared/hooks/useFilterUrlState.ts

import { useCallback, useMemo } from 'react';

import { useNavigate, useSearch } from '@tanstack/react-router';

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
  const navigate = useNavigate({ from: '/' });
  const search = useSearch({ strict: false });
  const mergedDefaults = useMemo(() => ({ ...DEFAULT_FILTER_STATE, ...defaults }), [defaults]);

  // Parse State from URL
  const state = useMemo((): DataTableFilterState => {
    // Type-safe parsing of search params
    const searchParams = search as Record<string, unknown>;

    return {
      page: Number(searchParams['page'] ?? mergedDefaults.page),
      pageSize: Number(searchParams['pageSize'] ?? mergedDefaults.pageSize),
      searchTerm: typeof searchParams['search'] === 'string' ? searchParams['search'] : '',
      sortBy: (searchParams['sortBy'] as string | undefined) ?? mergedDefaults.sortBy,
      sortOrder:
        (searchParams['sortOrder'] as 'asc' | 'desc' | undefined) ?? mergedDefaults.sortOrder,
    };
  }, [search, mergedDefaults]);

  // Update State
  const setState = useCallback(
    (updates: Partial<DataTableFilterState>) => {
      const newState = { ...state, ...updates };

      // Build clean params - only include non-default values
      const searchParams: Record<string, string> = {};

      if (newState.page !== mergedDefaults.page) {
        searchParams['page'] = String(newState.page);
      }
      if (newState.pageSize !== mergedDefaults.pageSize) {
        searchParams['pageSize'] = String(newState.pageSize);
      }
      if (newState.searchTerm) {
        searchParams['search'] = newState.searchTerm;
      }

      // Preserve existing sort if not explicitly changed
      if (updates.sortBy !== undefined || updates.sortOrder !== undefined) {
        // Sort was explicitly changed
        if (newState.sortBy && newState.sortOrder) {
          searchParams['sortBy'] = newState.sortBy;
          searchParams['sortOrder'] = newState.sortOrder;
        }
      }
      // Sort was not changed, preserve existing values
      else if (state.sortBy && state.sortOrder) {
        searchParams['sortBy'] = state.sortBy;
        searchParams['sortOrder'] = state.sortOrder;
      }

      // Navigate with new search params
      void navigate({
        to: '.',
        search: searchParams,
        replace: true,
      });
    },
    [state, mergedDefaults, navigate]
  );

  // Reset to defaults
  const resetState = useCallback(() => {
    void navigate({
      to: '.',
      search: {},
      replace: true,
    });
  }, [navigate]);

  return [state, setState, resetState] as const;
};

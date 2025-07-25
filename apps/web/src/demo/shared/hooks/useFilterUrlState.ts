// apps/web/src/demo/shared/hooks/useFilterUrlState.ts
// Final location: apps/web/src/shared/hooks/useFilterUrlState.ts

import { useCallback, useMemo } from 'react';

import { useLocation, useNavigate, useSearch } from '@tanstack/react-router';

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
 * Flow: URL → Defaults → Query
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
  const navigate = useNavigate();
  const location = useLocation();
  const search = useSearch({ strict: false });
  const mergedDefaults = useMemo(() => ({ ...DEFAULT_FILTER_STATE, ...defaults }), [defaults]);

  // Parse State from URL - URL has highest priority
  const state = useMemo((): DataTableFilterState => {
    // Type-safe parsing of search params
    const searchParams = search as Record<string, unknown>;

    return {
      page: searchParams['page'] !== undefined ? Number(searchParams['page']) : mergedDefaults.page,
      pageSize:
        searchParams['pageSize'] !== undefined
          ? Number(searchParams['pageSize'])
          : mergedDefaults.pageSize,
      searchTerm:
        searchParams['search'] !== undefined && typeof searchParams['search'] === 'string'
          ? searchParams['search']
          : '',
      sortBy:
        searchParams['sortBy'] !== undefined && typeof searchParams['sortBy'] === 'string'
          ? searchParams['sortBy']
          : mergedDefaults.sortBy,
      sortOrder:
        searchParams['sortOrder'] !== undefined &&
        (searchParams['sortOrder'] === 'asc' || searchParams['sortOrder'] === 'desc')
          ? searchParams['sortOrder']
          : mergedDefaults.sortOrder,
    };
  }, [search, mergedDefaults]);

  // Update State
  const setState = useCallback(
    (updates: Partial<DataTableFilterState>) => {
      const currentState = { ...state };
      const newState = { ...currentState, ...updates };

      // Build search params from complete state
      const searchParams: Record<string, string> = {};

      // Always include page if not default
      if (newState.page !== mergedDefaults.page) {
        searchParams['page'] = String(newState.page);
      }

      // Always include pageSize if not default
      if (newState.pageSize !== mergedDefaults.pageSize) {
        searchParams['pageSize'] = String(newState.pageSize);
      }

      // Include search if present
      if (newState.searchTerm) {
        searchParams['search'] = newState.searchTerm;
      }

      // Include sort if present (both values must exist)
      if (newState.sortBy && newState.sortOrder) {
        searchParams['sortBy'] = newState.sortBy;
        searchParams['sortOrder'] = newState.sortOrder;
      }

      // Navigate to current path with new search params
      void navigate({
        to: location.pathname,
        search: searchParams,
        replace: true,
      });
    },
    [state, mergedDefaults, navigate, location.pathname]
  );

  // Reset to defaults
  const resetState = useCallback(() => {
    // Reset to defaults but keep the current path
    const searchParams: Record<string, string> = {};

    // Only add non-default values from mergedDefaults
    if (mergedDefaults.sortBy && mergedDefaults.sortOrder) {
      searchParams['sortBy'] = mergedDefaults.sortBy;
      searchParams['sortOrder'] = mergedDefaults.sortOrder;
    }

    void navigate({
      to: location.pathname,
      search: searchParams,
      replace: true,
    });
  }, [navigate, location.pathname, mergedDefaults]);

  return [state, setState, resetState] as const;
};

// apps/web/src/demo/shared/hooks/useFilterUrlState.ts
// Final location: apps/web/src/shared/hooks/useFilterUrlState.ts

import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

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
 * @param defaults - Optionale Standard-Werte (überschreiben DEFAULT_FILTER_STATE)
 * @returns [state, setState, resetState] Tuple
 */
export const useFilterUrlState = (
  defaults: Partial<DataTableFilterState> = {}
): readonly [
  DataTableFilterState,
  (updates: Partial<DataTableFilterState>) => void,
  () => void,
] => {
  const [searchParams, setSearchParams] = useSearchParams();
  const mergedDefaults = { ...DEFAULT_FILTER_STATE, ...defaults };

  // Parse State from URL
  const state = useMemo((): DataTableFilterState => {
    const page = searchParams.get('page');
    const pageSize = searchParams.get('pageSize');
    const searchTerm = searchParams.get('search') ?? '';
    const sortBy = searchParams.get('sortBy') ?? undefined;
    const sortOrder = searchParams.get('sortOrder') as 'asc' | 'desc' | undefined;

    return {
      page: page ? Number(page) : mergedDefaults.page,
      pageSize: pageSize ? Number(pageSize) : mergedDefaults.pageSize,
      searchTerm,
      sortBy: sortBy ?? mergedDefaults.sortBy,
      sortOrder: sortOrder ?? mergedDefaults.sortOrder,
    };
  }, [searchParams, mergedDefaults]);

  // Update State
  const setState = useCallback(
    (updates: Partial<DataTableFilterState>) => {
      const newParams = new URLSearchParams();

      // Merge with current state
      const newState = { ...state, ...updates };

      // Only add non-default values to URL
      if (newState.page !== mergedDefaults.page) {
        newParams.set('page', String(newState.page));
      }
      if (newState.pageSize !== mergedDefaults.pageSize) {
        newParams.set('pageSize', String(newState.pageSize));
      }
      if (newState.searchTerm) {
        newParams.set('search', newState.searchTerm);
      }
      if (newState.sortBy) {
        newParams.set('sortBy', newState.sortBy);
        if (newState.sortOrder) {
          newParams.set('sortOrder', newState.sortOrder);
        }
      }

      setSearchParams(newParams, { replace: true });
    },
    [state, mergedDefaults, setSearchParams]
  );

  // Reset to defaults
  const resetState = useCallback(() => {
    setSearchParams(new URLSearchParams(), { replace: true });
  }, [setSearchParams]);

  return [state, setState, resetState] as const;
};

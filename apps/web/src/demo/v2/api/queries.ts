// src/entities/test/product/api/queries.ts
import { useMemo } from 'react';

import { useGlobalFilterQuery } from '@/shared/hooks/useGlobalFilterQuery';

import { PRODUCT_ENDPOINTS } from './endpoints';

import type { Product } from '../model/types';

type ProductListFilters = {
  page: number;
  pageSize: number;
  searchTerm: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
};

/**
 * useProductList Hook
 * @description Hook für Product-Listen mit Backend-kompatiblen Parametern
 */
export const useProductList = (filters: ProductListFilters) => {
  // Memoize filters für stabile Query Keys
  const memoizedFilters = useMemo(
    () => ({
      page: filters.page,
      pageSize: filters.pageSize,
      searchTerm: filters.searchTerm,
      sortBy: filters.sortBy,
      sortOrder: filters.sortOrder,
    }),
    [filters.page, filters.pageSize, filters.searchTerm, filters.sortBy, filters.sortOrder]
  );

  return useGlobalFilterQuery<Product>({
    endpoint: PRODUCT_ENDPOINTS.list,
    filters: memoizedFilters,
    queryKey: ['products', 'list'],
  });
};

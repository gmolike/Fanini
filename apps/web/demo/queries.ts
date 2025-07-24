// src/entities/test/product/api/queries.ts
import { useGlobalFilterQuery } from '@/shared/hooks/useGlobalFilterQuery';

import { PRODUCT_ENDPOINTS } from './endpoints';

import type { Product } from '../model/types';

type ProductListFilters = {
  page?: number;
  pageSize?: number;
  searchTerm?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
};

/**
 * useProductList Hook
 * @description Hook für Product-Listen mit Backend-kompatiblen Parametern
 */
export const useProductList = (filters: ProductListFilters = {}) => {
  return useGlobalFilterQuery<Product>({
    endpoint: PRODUCT_ENDPOINTS.list,
    filters,
    queryKey: ['products', 'list'],
  });
};

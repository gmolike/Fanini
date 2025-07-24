// apps/web/src/demo/entities/product/api/queries.ts
// Final location: apps/web/src/entities/product/api/queries.ts

import { useGlobalFilter } from '../../../shared/hooks/useGlobalFilter';

import type { DataTableFilterState } from '../../../shared/api/types/filter';
import type { Product } from '../model/types';

/**
 * Product API Endpoints
 * @description Zentrale Endpunkt-Definitionen
 */
const PRODUCT_ENDPOINTS = {
  list: '/api/products',
  detail: (id: string) => `/api/products/${id}`,
} as const;

/**
 * useProductList Hook
 * @description Lädt gefilterte Produktliste
 * @param filters - Filter-Parameter
 */
export const useProductList = (filters: DataTableFilterState) => {
  return useGlobalFilter<Product>({
    endpoint: PRODUCT_ENDPOINTS.list,
    queryKey: ['products', 'list'] as const,
    filters,
    options: {
      staleTime: 1000 * 60 * 5, // 5 Minuten
    },
  });
};

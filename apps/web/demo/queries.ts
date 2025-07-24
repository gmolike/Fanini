// src/entities/test/product/api/queries.ts
import { useMemo } from 'react';

import { PRODUCT_ENDPOINTS } from './endpoints';

import type { Product, ProductFilter, ProductListResponse } from '../model/types';
import { useGlobalFilterQuery } from 'demo/useGlobalFilterQuery';

/**
 * useProductList Hook
 * @description Hook für Product-Listen mit GlobalFilterResponse
 */
export const useProductList = (filters: ProductFilter = {}) => {
  return useGlobalFilterQuery<Product>({
    endpoint: PRODUCT_ENDPOINTS.list,
    filters,
    queryKey: ['products', 'list'],
  });
};
};

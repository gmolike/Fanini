// src/entities/test/product/api/queries.ts
import { useRemoteQuery } from '@/shared/api/query';

import { PRODUCT_ENDPOINTS } from './endpoints';

import type { Product, ProductFilter, ProductListResponse } from '../model/types';

/**
 * useProductList Hook
 * @description Hook für Product-Listen mit Server-Side Features
 */
export const useProductList = (filters: ProductFilter = {}) => {
  // Build Query String
  const params = new URLSearchParams();

  if (filters.search) params.append('search', filters.search);
  if (filters.page) params.append('page', String(filters.page));
  if (filters.limit) params.append('limit', String(filters.limit));
  if (filters.sortBy) params.append('sortBy', filters.sortBy);
  if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);

  const queryString = params.toString();
  const endpoint = queryString
    ? `${PRODUCT_ENDPOINTS.list}?${queryString}`
    : PRODUCT_ENDPOINTS.list;

  return useRemoteQuery<ProductListResponse>(['products', 'list', filters], endpoint, undefined, {
    staleTime: 1000 * 60 * 5, // 5 Minuten
    keepPreviousData: true, // Smooth pagination
  });
};

/**
 * useProductDetail Hook
 * @description Hook für einzelne Product Details
 */
export const useProductDetail = (productId: string) => {
  return useRemoteQuery<Product>(
    ['products', 'detail', productId],
    PRODUCT_ENDPOINTS.detail(productId),
    undefined,
    {
      enabled: !!productId,
      staleTime: 1000 * 60 * 10, // 10 Minuten
    }
  );
};

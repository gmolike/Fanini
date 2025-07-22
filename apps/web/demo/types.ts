// src/entities/test/product/model/types.ts

/**
 * Product Entity Types
 * @description Type-Definitionen für die Product Entity
 */
export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  sku: string;
  inStock: boolean;
  createdAt: string;
  updatedAt: string;
};

export type ProductListResponse = {
  items: Product[];
  meta: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
};

export type ProductFilter = {
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
};

// src/entities/test/product/model/types.ts
/**
 * GlobalFilterResponse Type
 * @description Standardisierter Response-Type für alle gefilterten Listen
 */
export type GlobalFilterResponse<TData> = {
  page: number;
  limit: number;
  search: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  totalNumber: number;
  result: TData[];
};

/**
 * Product Entity Types
 * @description Type-Definitionen für die Product Entity
 */
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

// Nutze den globalen Response Type
export type ProductListResponse = GlobalFilterResponse<Product>;

// Erweitere ServerSideParams für Multi-Sort
export type ServerSideParams = {
  search?: string;
  page: number;
  limit: number;
  sorts?: { field: string; order: 'asc' | 'desc' }[]; // Für Multi-Sort
};

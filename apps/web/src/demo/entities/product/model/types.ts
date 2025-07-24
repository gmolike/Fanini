// apps/web/src/demo/entities/product/model/types.ts
// Final location: apps/web/src/entities/product/model/types.ts

/**
 * Product Entity Type
 * @description Produkt-Datenmodell
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

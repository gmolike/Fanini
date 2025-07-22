// src/entities/test/product/model/schemas.ts
import { z } from 'zod';

/**
 * Product Validation Schemas
 * @description Zod Schemas für Product Entity Validierung
 */
export const productSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  description: z.string(),
  price: z.number().positive(),
  category: z.string(),
  sku: z.string(),
  inStock: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const productListResponseSchema = z.object({
  items: z.array(productSchema),
  meta: z.object({
    total: z.number(),
    page: z.number(),
    limit: z.number(),
    pages: z.number(),
  }),
});

export const productFilterSchema = z.object({
  search: z.string().optional(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});

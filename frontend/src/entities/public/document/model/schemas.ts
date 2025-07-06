// frontend/src/entities/public/document/model/schemas.ts
import { z } from 'zod';

export const documentSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  category: z.enum(['satzung', 'protokolle', 'formulare', 'richtlinien', 'guides']),
  fileUrl: z.string().url(),
  fileSize: z.number(),
  fileType: z.string(),
  version: z.string(),
  status: z.enum(['current', 'outdated', 'draft']),
  publishedAt: z.string(),
  updatedAt: z.string().optional(),
  author: z.string().optional(),
  downloads: z.number(),
  tags: z.array(z.string()).optional(),
  isFeatured: z.boolean().optional(),
});

export const documentListResponseSchema = z.object({
  data: z.array(
    documentSchema
      .pick({
        id: true,
        title: true,
        category: true,
        fileType: true,
        fileSize: true,
        version: true,
        publishedAt: true,
        status: true,
      })
      .extend({
        preview: z.string().optional(),
      })
  ),
  meta: z.object({
    total: z.number(),
    categories: z.array(z.string()),
  }),
});

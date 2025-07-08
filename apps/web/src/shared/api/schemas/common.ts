// shared/api/schemas/common.ts
import { z } from 'zod';

/**
 * Basis Pagination Meta-Daten
 */
export const basePaginationMetaSchema = z.object({
  total: z.number(),
  page: z.number().optional(),
  limit: z.number().optional(),
  hasMore: z.boolean().optional(),
});

/**
 * Creator-spezifische Meta-Daten
 */
export const creatorMetaSchema = z.object({
  total: z.number(),
  types: z.array(z.string()),
});

/**
 * Creator Works Meta-Daten
 */
export const creatorWorksMetaSchema = z.object({
  total: z.number(),
  hasMore: z.boolean(),
});

/**
 * Generische Response-Wrapper Funktion
 */
export const createResponseSchema = <T extends z.ZodTypeAny>(
  dataSchema: T,
  metaSchema?: z.ZodTypeAny
) =>
  z.object({
    data: dataSchema,
    meta: metaSchema ?? basePaginationMetaSchema.optional(),
  });
/**
 * Timestamp-Felder für Entities
 */
export const timestampFieldsSchema = z.object({
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime().optional(),
});

/**
 * Author-Tracking Felder
 */
export const authorFieldsSchema = z.object({
  createdBy: z.string(),
  updatedBy: z.string().optional(),
});

/**
 * Social Media Links Schema
 */
export const socialLinksSchema = z.object({
  instagram: z.string().url().optional(),
  twitter: z.string().url().optional(),
  facebook: z.string().url().optional(),
  youtube: z.string().url().optional(),
  tiktok: z.string().url().optional(),
  website: z.string().url().optional(),
});

/**
 * Basis Stats Schema
 */
export const baseStatsSchema = z.object({
  views: z.number().default(0),
  likes: z.number().default(0),
  shares: z.number().default(0),
});

/**
 * Gemeinsame Status-Enums
 */
export const statusEnum = ['draft', 'published', 'archived', 'pending'] as const;
export const visibilityEnum = ['public', 'private', 'members-only'] as const;

/**
 * File/Media Schema
 */
export const fileSchema = z.object({
  url: z.string().url(),
  size: z.number(),
  type: z.string(),
  name: z.string().optional(),
});

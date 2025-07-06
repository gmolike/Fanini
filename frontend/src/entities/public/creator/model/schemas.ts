// entities/public/creator/model/schemas.ts
import { z } from 'zod';

export const creatorSchema = z.object({
  id: z.string(),
  memberId: z.string(),
  artistName: z.string(),
  realName: z.string().optional(),
  profileImage: z.string().optional(),
  description: z.string(),
  type: z.array(z.enum(['grafik', 'foto', 'video', 'musik', 'other'])),
  portfolio: z.string(),
  isActive: z.boolean(),
  activeSince: z.string(),
  deactivatedAt: z.string().optional(),
  instagram: z.string().optional(),
  twitter: z.string().optional(),
  facebook: z.string().optional(),
  youtube: z.string().optional(),
  tiktok: z.string().optional(),
  website: z.string().optional(),
  stats: z.object({
    worksCount: z.number(),
    viewsCount: z.number(),
    likesCount: z.number(),
  }),
});

export const creatorWorkSchema = z.object({
  id: z.string(),
  creatorId: z.string(),
  title: z.string(),
  description: z.string().optional(),
  type: z.enum(['image', 'video', 'audio', 'text']),
  fileUrl: z.string(),
  thumbnailUrl: z.string().optional(),
  createdAt: z.string(),
  publishedAt: z.string().optional(),
  isPublic: z.boolean(),
  order: z.number(),
  tags: z.array(z.string()),
  stats: z.object({
    views: z.number(),
    likes: z.number(),
  }),
});

export const creatorListItemSchema = z.object({
  id: z.string(),
  artistName: z.string(),
  profileImage: z.string().optional(),
  type: z.array(z.enum(['grafik', 'foto', 'video', 'musik', 'other'])),
  shortDescription: z.string(),
  worksCount: z.number(),
  isActive: z.boolean(),
});

// Response schemas
export const creatorsListResponseSchema = z.object({
  data: z.array(creatorListItemSchema),
  meta: z
    .object({
      total: z.number(),
      types: z.array(z.string()),
    })
    .optional(),
});

export const creatorDetailResponseSchema = z.object({
  data: creatorSchema,
});

export const creatorWorksResponseSchema = z.object({
  data: z.array(creatorWorkSchema),
  meta: z
    .object({
      total: z.number(),
      hasMore: z.boolean(),
    })
    .optional(),
});

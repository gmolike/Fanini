// entities/public/creator/model/schemas.ts
import { z } from 'zod';

import {
  createResponseSchema,
  creatorMetaSchema,
  creatorWorksMetaSchema,
} from '@/shared/api/schemas/common';
import { createDTOSchemaBuilder } from '@/shared/lib/dto-schema-builder';

// Type-safe creator type tuple
type CreatorTypeTuple = ['grafik', 'foto', 'video', 'musik', 'other'];
export const creatorTypeEnum: CreatorTypeTuple = ['grafik', 'foto', 'video', 'musik', 'other'];

// DTO Definition
const creatorDTO = z.object({
  id: z.string(),
  memberId: z.string(),
  artistName: z.string(),
  realName: z.string(),
  profileImage: z.string(),
  description: z.string(),
  type: z.array(z.string()),
  portfolio: z.string(),
  isActive: z.boolean(),
  activeSince: z.string(),
  deactivatedAt: z.string(),
  instagram: z.string(),
  twitter: z.string(),
  facebook: z.string(),
  youtube: z.string(),
  tiktok: z.string(),
  website: z.string(),
  stats: z.object({
    worksCount: z.number(),
    viewsCount: z.number(),
    likesCount: z.number(),
  }),
});

const creatorLabels = {
  id: 'ID',
  memberId: 'Mitglieds-ID',
  artistName: 'Künstlername',
  realName: 'Echter Name',
  profileImage: 'Profilbild',
  description: 'Beschreibung',
  type: 'Creator-Typ',
  portfolio: 'Portfolio',
  isActive: 'Aktiv-Status',
  activeSince: 'Aktiv seit',
  deactivatedAt: 'Deaktiviert am',
  instagram: 'Instagram',
  twitter: 'Twitter',
  facebook: 'Facebook',
  youtube: 'YouTube',
  tiktok: 'TikTok',
  website: 'Website',
  stats: 'Statistiken',
} as const;

const builder = createDTOSchemaBuilder(creatorDTO, creatorLabels);

// Haupt Creator Schema
export const creatorSchema = builder.extend(b => ({
  id: b.requiredString('id'),
  memberId: b.requiredString('memberId'),
  artistName: b.requiredString('artistName', 2),
  realName: b.optionalString('realName'),
  profileImage: b.url('profileImage', { optional: true }),
  description: b.requiredString('description', 10),
  type: b.array('type', z.enum(creatorTypeEnum), { min: 1 }),
  portfolio: b.url('portfolio'),
  isActive: b.boolean(), // Ohne key für generisches boolean
  activeSince: b.dateString('activeSince'),
  deactivatedAt: b.dateString('deactivatedAt', { optional: true }),
  instagram: b.url('instagram', { optional: true }),
  twitter: b.url('twitter', { optional: true }),
  facebook: b.url('facebook', { optional: true }),
  youtube: b.url('youtube', { optional: true }),
  tiktok: b.url('tiktok', { optional: true }),
  website: b.url('website', { optional: true }),
  stats: z.object({
    worksCount: z.number().min(0),
    viewsCount: z.number().min(0),
    likesCount: z.number().min(0),
  }),
}));

// Work Schema
type WorkTypeTuple = ['image', 'video', 'audio', 'text'];
const workTypeEnum: WorkTypeTuple = ['image', 'video', 'audio', 'text'];

const workDTO = z.object({
  id: z.string(),
  creatorId: z.string(),
  title: z.string(),
  description: z.string(),
  type: z.string(),
  fileUrl: z.string(),
  thumbnailUrl: z.string(),
  createdAt: z.string(),
  publishedAt: z.string(),
  isPublic: z.boolean(),
  order: z.number(),
  tags: z.array(z.string()),
  stats: z.object({
    views: z.number(),
    likes: z.number(),
  }),
});

const workLabels = {
  id: 'ID',
  creatorId: 'Creator-ID',
  title: 'Titel',
  description: 'Beschreibung',
  type: 'Werktyp',
  fileUrl: 'Datei-URL',
  thumbnailUrl: 'Vorschaubild',
  createdAt: 'Erstellt am',
  publishedAt: 'Veröffentlicht am',
  isPublic: 'Öffentlich',
  order: 'Reihenfolge',
  tags: 'Tags',
  stats: 'Statistiken',
} as const;

const workBuilder = createDTOSchemaBuilder(workDTO, workLabels);

export const creatorWorkSchema = workBuilder.extend(b => ({
  id: b.requiredString('id'),
  creatorId: b.requiredString('creatorId'),
  title: b.requiredString('title', 2),
  description: b.optionalString('description'),
  type: b.enum('type', workTypeEnum),
  fileUrl: b.url('fileUrl'),
  thumbnailUrl: b.url('thumbnailUrl', { optional: true }),
  createdAt: b.dateString('createdAt'),
  publishedAt: b.dateString('publishedAt', { optional: true }),
  isPublic: b.boolean(), // Ohne key
  order: b.requiredNumber('order', { min: 0 }),
  tags: b.array('tags', z.string(), { optional: true }),
  stats: z.object({
    views: z.number(),
    likes: z.number(),
  }),
}));

// List Item Schema
export const creatorListItemSchema = z.object({
  id: z.string(),
  artistName: z.string(),
  profileImage: z.string().optional(),
  type: z.array(z.enum(creatorTypeEnum)),
  shortDescription: z.string(),
  worksCount: z.number(),
  isActive: z.boolean(),
});

// Response Schemas
export const creatorsListResponseSchema = createResponseSchema(
  z.array(creatorListItemSchema),
  creatorMetaSchema.optional()
);

export const creatorDetailResponseSchema = createResponseSchema(creatorSchema);

export const creatorWorksResponseSchema = createResponseSchema(
  z.array(creatorWorkSchema),
  creatorWorksMetaSchema.optional()
);

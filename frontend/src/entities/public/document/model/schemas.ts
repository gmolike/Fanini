// entities/public/document/model/schemas.ts
import { z } from 'zod';

import { createResponseSchema } from '@/shared/api/schemas/common';
import { createDTOSchemaBuilder } from '@/shared/lib/dto-schema-builder';

// Type-safe enum tuples
type DocumentCategoryTuple = ['satzung', 'protokolle', 'formulare', 'richtlinien', 'guides'];
export const documentCategoryEnum: DocumentCategoryTuple = [
  'satzung',
  'protokolle',
  'formulare',
  'richtlinien',
  'guides',
];

type DocumentStatusTuple = ['current', 'outdated', 'draft'];
export const documentStatusEnum: DocumentStatusTuple = ['current', 'outdated', 'draft'];

// DTO und Labels
const documentDTO = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  category: z.string(),
  fileUrl: z.string(),
  fileSize: z.number(),
  fileType: z.string(),
  version: z.string(),
  status: z.string(),
  publishedAt: z.string(),
  updatedAt: z.string(),
  author: z.string(),
  downloads: z.number(),
  tags: z.array(z.string()),
  isFeatured: z.boolean(),
});

const documentLabels = {
  id: 'Dokument-ID',
  title: 'Titel',
  description: 'Beschreibung',
  category: 'Kategorie',
  fileUrl: 'Datei-URL',
  fileSize: 'Dateigröße',
  fileType: 'Dateityp',
  version: 'Version',
  status: 'Status',
  publishedAt: 'Veröffentlicht am',
  updatedAt: 'Aktualisiert am',
  author: 'Autor',
  downloads: 'Downloads',
  tags: 'Tags',
  isFeatured: 'Hervorgehoben',
} as const;

const builder = createDTOSchemaBuilder(documentDTO, documentLabels);

export const documentSchema = builder.extend(
  b => ({
    id: b.requiredString('id'),
    title: b.requiredString('title', 3),
    description: b.optionalString('description'),
    category: b.enum('category', documentCategoryEnum),
    fileUrl: b.url('fileUrl', { allowRelative: true }),
    fileSize: b.requiredNumber('fileSize', { min: 0 }),
    fileType: b.requiredString('fileType'),
    version: b.requiredString('version'),
    status: b.enum('status', documentStatusEnum),
    publishedAt: b.dateString('publishedAt'),
    updatedAt: b.dateString('updatedAt', { optional: true }),
    author: b.optionalString('author'),
    downloads: b.requiredNumber('downloads', { min: 0 }),
    tags: b.array('tags', z.string(), { optional: true }),
    isFeatured: z.boolean().optional(),
  }),
  {
    refine: [
      {
        check: data => {
          return (
            data.fileUrl.startsWith('/') ||
            data.fileUrl.startsWith('http://') ||
            data.fileUrl.startsWith('https://')
          );
        },
        params: {
          message: 'Datei-URL muss ein gültiger Pfad oder eine vollständige URL sein',
          path: ['fileUrl'],
        },
      },
    ],
  }
);

// List Item Schema explizit definiert
export const documentListItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  category: z.enum(documentCategoryEnum),
  fileType: z.string(),
  fileSize: z.number(),
  version: z.string(),
  publishedAt: z.string(),
  status: z.enum(documentStatusEnum),
  preview: z.string().optional(),
});

// Response Schemas
export const documentListResponseSchema = createResponseSchema(
  z.array(documentListItemSchema)
).extend({
  meta: z.object({
    total: z.number(),
    categories: z.array(z.string()),
  }),
});

// frontend/src/entities/public/newsletter/model/schemas.ts
import { z } from 'zod';

const newsletterAuthorSchema = z.object({
  id: z.string(),
  name: z.string(),
  role: z.string().optional(),
  avatar: z.string().optional(),
});

const newsletterImageSchema = z.object({
  url: z.string(),
  caption: z.string().optional(),
  position: z.enum(['inline', 'header', 'gallery']).optional(),
});

const newsletterArticleSchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string(),
  author: newsletterAuthorSchema,
  teamId: z.string().optional(),
  teamName: z.string().optional(),
  category: z.enum([
    'team-update',
    'event-recap',
    'announcement',
    'community',
    'esports',
    'baller-league',
    'feature',
  ]),
  images: z.array(newsletterImageSchema).optional(),
  order: z.number(),
  tags: z.array(z.string()).optional(),
});

export const newsletterSchema = z.object({
  id: z.string(),
  edition: z.number(),
  title: z.string(),
  subtitle: z.string().optional(),
  publishedAt: z.string(),
  author: newsletterAuthorSchema,
  status: z.enum(['draft', 'published', 'archived']),
  tags: z.array(z.string()),
  headerImage: z.string().optional(),
  introduction: z.string(),
  articles: z.array(newsletterArticleSchema),
  closingMessage: z.string().optional(),
  nextEditionHint: z.string().optional(),
});

export const newsletterListItemSchema = newsletterSchema.pick({
  id: true,
  edition: true,
  title: true,
  subtitle: true,
  publishedAt: true,
  tags: true,
  headerImage: true,
});

export const newsletterListResponseSchema = z.object({
  data: z.array(newsletterListItemSchema),
  meta: z.object({
    total: z.number(),
    page: z.number(),
    limit: z.number(),
    hasMore: z.boolean(),
  }),
});

export const newsletterDetailResponseSchema = z.object({
  data: newsletterSchema,
});

export const newsletterSubscriptionSchema = z.object({
  email: z.string().email('Bitte gib eine gültige E-Mail-Adresse ein'),
  firstName: z.string().min(2, 'Der Vorname muss mindestens 2 Zeichen lang sein'),
  lastName: z.string().optional(),
  acceptsMarketing: z.boolean().refine(val => val, {
    message: 'Du musst dem Newsletter-Empfang zustimmen',
  }),
});

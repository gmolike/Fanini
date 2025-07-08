// frontend/src/entities/public/faq/model/schemas.ts
import { z } from 'zod';

export const faqItemSchema = z.object({
  id: z.string(),
  question: z.string(),
  answer: z.string(),
  category: z.enum(['mitgliedschaft', 'events', 'verein', 'technik', 'sonstige']),
  order: z.number(),
  views: z.number(),
  isPopular: z.boolean().optional(),
  relatedFaqIds: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  updatedAt: z.string(),
});

export const faqListResponseSchema = z.object({
  data: z.array(faqItemSchema),
  meta: z.object({
    total: z.number(),
    categories: z.array(z.string()),
  }),
});

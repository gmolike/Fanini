// frontend/src/entities/public/event/model/schemas.ts
import { z } from 'zod';

// NEUE SCHEMAS (behalten)

// Basis Event Schema für Listen-Ansicht
export const publicEventListItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  date: z.string(),
  time: z.string(),
  location: z.string(),
  type: z.enum(['party', 'away', 'meeting', 'match', 'concert', 'training']),
  category: z.enum(['sport', 'culture', 'social', 'official']),
  maxParticipants: z.number().optional(),
  currentParticipants: z.number().optional(),
  thumbnailImage: z.string().optional(),
  isPublic: z.literal(true),
  organizer: z.enum(['faninitiative', 'eintracht', 'external']),
  organizerDetails: z
    .object({
      name: z.string(),
      logo: z.string().optional(),
      color: z.string(),
    })
    .optional(),
});

// Detailliertes Event Schema
export const publicEventDetailSchema = publicEventListItemSchema.extend({
  description: z.string(),
  bannerImage: z.string().optional(),
  responsiblePerson: z
    .object({
      name: z.string(),
      role: z.string().optional(),
      contact: z.string().optional(),
    })
    .optional(),
  registrationRequired: z.boolean(),
  registrationDeadline: z.string().optional(),
  ticketLink: z.string().optional(),
  price: z
    .object({
      amount: z.number(),
      currency: z.string().optional(),
      description: z.string().optional(),
    })
    .optional(),
  history: z
    .array(
      z.object({
        date: z.string(),
        action: z.enum(['created', 'updated', 'announced', 'registration_opened', 'sold_out']),
        description: z.string(),
      })
    )
    .optional(),
  comments: z
    .array(
      z.object({
        id: z.string(),
        author: z.object({
          name: z.string(),
          role: z.string().optional(),
          avatar: z.string().optional(),
        }),
        content: z.string(),
        createdAt: z.string(),
        isOfficial: z.boolean(),
      })
    )
    .optional(),
  status: z.enum(['upcoming', 'ongoing', 'completed', 'cancelled']),
  tags: z.array(z.string()).optional(),
  relatedEvents: z
    .array(
      z.object({
        id: z.string(),
        title: z.string(),
        date: z.string(),
      })
    )
    .optional(),
});

// Response Schemas
export const publicEventListResponseSchema = z.object({
  data: z.array(publicEventListItemSchema),
  meta: z.object({
    total: z.number(),
    page: z.number(),
    limit: z.number(),
    hasMore: z.boolean(),
  }),
});

export const publicEventDetailResponseSchema = z.object({
  data: publicEventDetailSchema,
});

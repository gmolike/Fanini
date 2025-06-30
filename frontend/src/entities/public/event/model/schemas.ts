// frontend/src/entities/public/event/model/schemas.ts
import { z } from 'zod';

export const publicEventSchema = z.object({
  id: z.string(),
  title: z.string(),
  date: z.string(),
  time: z.string(),
  location: z.string(),
  type: z.enum(['party', 'away', 'meeting', 'match']),
  description: z.string(),
  shortDescription: z.string().nullable().optional(),
  image: z.string().nullable().optional(),
  maxParticipants: z.number().nullable().optional(),
  currentParticipants: z.number().nullable().optional(),
  isPublic: z.literal(true),
});

export const publicEventsResponseSchema = z.object({
  data: z.array(publicEventSchema),
  meta: z
    .object({
      total: z.number(),
      page: z.number(),
      limit: z.number(),
    })
    .optional(),
});

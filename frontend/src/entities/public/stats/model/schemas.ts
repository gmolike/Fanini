// frontend/src/entities/public/stats/model/schemas.ts
import { z } from 'zod';

export const statsResponseSchema = z.object({
  data: statsSchema,
});

export const statsSchema = z.object({
  memberCount: z.number(),
  eventsPerYear: z.number(),
  foundedYear: z.number(),
  passionPercentage: z.number(),
});

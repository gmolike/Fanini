// frontend/src/entities/public/stats/model/schemas.ts
import { z } from 'zod';

// WICHTIG: Erst statsSchema definieren
export const statsSchema = z.object({
  memberCount: z.number(),
  eventsPerYear: z.number(),
  foundedYear: z.number(),
  passionPercentage: z.number(),
});

// DANN statsResponseSchema, da es statsSchema verwendet
export const statsResponseSchema = z.object({
  data: statsSchema,
});

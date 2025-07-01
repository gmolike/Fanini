// entities/public/organization/model/schemas.ts
import { z } from 'zod';

// Schemas genau wie bei Events
export const boardMemberSchema = z.object({
  id: z.string(),
  name: z.string(),
  role: z.enum([
    'erste_vorsitzende',
    'zweite_vorsitzende',
    'kassenwartin',
    'schriftfuehrerin',
    'event_managerin',
    'medienbeauftragte',
    'technik_koordinatorin',
    'mitgliederverwalterin',
  ]),
  roleLabel: z.string(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  image: z.string().optional(),
  description: z.string().optional(),
  memberSince: z.string(),
  responsibilities: z.array(z.string()),
  order: z.number(),
});

export const organizationNodeSchema: z.ZodType = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum(['board', 'advisory', 'team', 'audit']),
  level: z.number(),
  members: z.array(boardMemberSchema).optional(),
  children: z.lazy(() => z.array(organizationNodeSchema)).optional(),
  description: z.string().optional(),
});

export const documentSchema = z.object({
  id: z.string(),
  title: z.string(),
  type: z.enum(['satzung', 'geschaeftsordnung', 'protokoll', 'other']),
  fileUrl: z.string(),
  fileSize: z.number(),
  updatedAt: z.string(),
  category: z.string(),
});

// Response schemas
export const boardMembersResponseSchema = z.object({
  data: z.array(boardMemberSchema),
  meta: z
    .object({
      total: z.number(),
    })
    .optional(),
});

export const organizationStructureResponseSchema = z.object({
  data: organizationNodeSchema,
});

export const documentsResponseSchema = z.object({
  data: z.array(documentSchema),
  meta: z
    .object({
      total: z.number(),
    })
    .optional(),
});

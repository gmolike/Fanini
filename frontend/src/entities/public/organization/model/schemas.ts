// entities/public/organization/model/schemas.ts
import { z } from 'zod';

export const gremiumMemberSchema = z.object({
  id: z.string(),
  name: z.string(),
  role: z.string(),
  image: z.string().optional(),
  description: z.string().optional(),
  memberSince: z.string(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  responsibilities: z.array(z.string()).optional(),
});

export const gremiumListItemSchema = z.object({
  id: z.string(),
  type: z.enum([
    'vorstand',
    'beirat',
    'team_event',
    'team_medien',
    'team_technik',
    'team_verein',
    'kassenpruefung',
  ]),
  name: z.string(),
  shortDescription: z.string(),
  memberCount: z.number(),
  establishedDate: z.string(),
  headerImage: z.string().optional(),
  gradient: z.string(),
});

export const gremiumSchema = z.object({
  id: z.string(),
  type: z.enum([
    'vorstand',
    'beirat',
    'team_event',
    'team_medien',
    'team_technik',
    'team_verein',
    'kassenpruefung',
  ]),
  name: z.string(),
  description: z.string(),
  shortDescription: z.string(),
  headerImage: z.string().optional(),
  gradient: z.string(),
  members: z.array(gremiumMemberSchema),
  responsibilities: z.array(z.string()),
  meetingSchedule: z.string().optional(),
  contactEmail: z.string().email().optional(),
  establishedDate: z.string(),
  stats: z.object({
    memberCount: z.number(),
    projectsCompleted: z.number().optional(),
    eventsOrganized: z.number().optional(),
    activeSince: z.string(),
  }),
  highlights: z
    .array(
      z.object({
        title: z.string(),
        description: z.string(),
        date: z.string().optional(),
      })
    )
    .optional(),
  images: z.array(z.string()).optional(),
});

export const organizationDocumentSchema = z.object({
  id: z.string(),
  title: z.string(),
  type: z.enum(['satzung', 'geschaeftsordnung', 'protokoll', 'formular', 'other']),
  fileUrl: z.string(),
  fileSize: z.number(),
  updatedAt: z.string(),
  category: z.string(),
  description: z.string().optional(),
});

export const relationshipNodeSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum(['mutterverein', 'fanfreundschaft', 'kooperation', 'partnerschaft']),
  description: z.string(),
  logo: z.string().optional(),
  since: z.string(),
  active: z.boolean(),
  link: z.string().optional(),
});

// Response Schemas
export const gremienListResponseSchema = z.object({
  data: z.array(gremiumListItemSchema),
  meta: z
    .object({
      total: z.number(),
    })
    .optional(),
});

export const gremiumDetailResponseSchema = z.object({
  data: gremiumSchema,
});

export const documentsResponseSchema = z.object({
  data: z.array(organizationDocumentSchema),
  meta: z
    .object({
      total: z.number(),
      categories: z.array(z.string()),
    })
    .optional(),
});

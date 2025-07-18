import { z } from 'zod';

import { createResponseSchema } from '@/shared/api/schemas/common';

// Type-safe enum tuples
export const memberRoleEnum = [
  'ADMIN',
  'VORSTAND',
  'BEIRAT',
  'KASSENPRUFER',
  'TEAM_EVENT',
  'TEAM_TECHNIK',
  'TEAM_MEDIEN',
  'TEAM_VEREIN',
  'MITGLIED',
] as const;

export const sensitivityLevelEnum = ['none', 'low', 'medium', 'high', 'critical'] as const;

// Base Member Schema (shared fields)
const baseMemberSchema = z.object({
  id: z.string(),
  vorname: z.string(),
  nachname: z.string(),
  email: z.string().email(),
  mitgliedsnummer: z.string(),
  istAktiv: z.boolean(),
  mitgliedSeit: z.string(), // ISO date string
  profilbild: z.string().optional(),
});

// Member List Item Schema (permission-aware)
export const memberListItemSchema = baseMemberSchema.extend({
  // Optional fields based on permissions
  telefon: z.string().optional(),
  geburtsdatum: z.string().optional(),
  rolle: z.array(z.enum(memberRoleEnum)).default(['MITGLIED']),
  letzteAktivitaet: z.string().optional(),
  // Display helpers
  vollstaendigerName: z.string().optional(),
});

// Member Detail Schema (full data with permissions)
export const memberDetailSchema = memberListItemSchema.extend({
  // Medium sensitivity
  adresse: z
    .object({
      strasse: z.string(),
      hausnummer: z.string(),
      plz: z.string(),
      stadt: z.string(),
    })
    .optional(),
  // High sensitivity
  notfallkontakt: z
    .object({
      name: z.string(),
      telefon: z.string(),
    })
    .optional(),
  // Critical sensitivity
  iban: z.string().optional(),
  // Metadata
  hatVertraulichkeitserklaerung: z.boolean(),
  sichtbarkeit: z
    .object({
      email: z.enum(['alle', 'mitglieder', 'vorstand', 'niemand']),
      telefon: z.enum(['alle', 'mitglieder', 'vorstand', 'niemand']),
      profil: z.enum(['alle', 'mitglieder', 'vorstand', 'niemand']),
    })
    .optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

// Update Member Request Schema
export const updateMemberSchema = z.object({
  vorname: z.string().min(2).max(100).optional(),
  nachname: z.string().min(2).max(100).optional(),
  email: z.string().email().optional(),
  telefon: z
    .string()
    .regex(/^[\d\s\-+()]+$/)
    .optional(),
  mitgliedsnummer: z.string().optional(),
  istAktiv: z.boolean().optional(),
  geburtsdatum: z.string().optional(),
  adresse: z
    .object({
      strasse: z.string().min(3),
      hausnummer: z.string(),
      plz: z.string().regex(/^\d{5}$/),
      stadt: z.string().min(2),
    })
    .optional(),
  iban: z
    .string()
    .regex(/^[A-Z]{2}\d{2}[A-Z0-9]+$/)
    .optional(),
  notfallkontakt: z
    .object({
      name: z.string().min(3),
      telefon: z.string().regex(/^[\d\s\-+()]+$/),
    })
    .optional(),
});

// Assign Role Schema
export const assignRoleSchema = z.object({
  rolle: z.enum(memberRoleEnum),
  gueltigBis: z.string().optional(),
  begruendung: z.string().min(10),
});

// Filter Schema
export const memberFilterSchema = z.object({
  active: z.boolean().optional(),
  search: z.string().optional(),
  roleId: z.enum(memberRoleEnum).optional(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),
});

// Response Schemas
export const memberListResponseSchema = createResponseSchema(z.array(memberListItemSchema)).extend({
  meta: z.object({
    total: z.number(),
    page: z.number(),
    limit: z.number(),
    pages: z.number(),
    filtered: z.boolean(),
  }),
});

export const memberDetailResponseSchema = createResponseSchema(memberDetailSchema);

// Permission Schema
export const userPermissionsSchema = z.object({
  userId: z.string(),
  role: z.enum(memberRoleEnum),
  permissions: z.array(z.string()),
  dataAccess: z.object({
    members: z.object({
      read: z.boolean(),
      write: z.boolean(),
      sensitivityLevel: z.enum(sensitivityLevelEnum),
    }),
  }),
});

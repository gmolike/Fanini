/* eslint-disable sonarjs/no-duplicate-string */
import { z } from 'zod';

import { createResponseSchema } from '@/shared/api/schemas/common';

// ============================================
// ENUMS
// ============================================
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
export const sichtbarkeitEnum = ['alle', 'mitglieder', 'vorstand', 'niemand'] as const;
export const memberTypeEnum = ['creator', 'sponsor', 'partner'] as const;
export const passwordOptionEnum = ['none', 'generate', 'manual'] as const;

// ============================================
// SHARED SUB-SCHEMAS
// ============================================
const adresseSchema = z.object({
  strasse: z.string().min(3, 'Mindestens 3 Zeichen'),
  hausnummer: z.string().min(1, 'Hausnummer erforderlich'),
  plz: z.string().regex(/^\d{5}$/, 'PLZ muss 5 Ziffern haben'),
  stadt: z.string().min(2, 'Mindestens 2 Zeichen'),
});

const notfallkontaktSchema = z.object({
  name: z.string().min(3, 'Mindestens 3 Zeichen'),
  telefon: z.string().regex(/^[\d\s\-+()]+$/, 'Ungültiges Telefonformat'),
});

const sichtbarkeitSchema = z.object({
  email: z.enum(sichtbarkeitEnum),
  telefon: z.enum(sichtbarkeitEnum),
  profil: z.enum(sichtbarkeitEnum),
});

// ============================================
// BASE MEMBER SCHEMAS
// ============================================
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

// Member List Item Schema
export const memberListItemSchema = baseMemberSchema.extend({
  telefon: z.string().optional(),
  geburtsdatum: z.string().optional(),
  rolle: z.array(z.enum(memberRoleEnum)).default(['MITGLIED']),
  letzteAktivitaet: z.string().optional(),
  vollstaendigerName: z.string().optional(),
});

// Member Detail Schema
export const memberDetailSchema = memberListItemSchema.extend({
  adresse: adresseSchema.optional(),
  notfallkontakt: notfallkontaktSchema.optional(),
  iban: z.string().optional(),
  hatVertraulichkeitserklaerung: z.boolean(),
  sichtbarkeit: sichtbarkeitSchema.optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

// ============================================
// REQUEST SCHEMAS - CREATE
// ============================================
export const createMemberSchema = z.object({
  memberType: z.enum(memberTypeEnum),
  vorname: z.string().min(2, 'Mindestens 2 Zeichen'),
  nachname: z.string().min(2, 'Mindestens 2 Zeichen'),
  email: z.string().email('Ungültige E-Mail-Adresse'),
  telefon: z.string().optional(),
  kuenstlername: z.string().optional(),
  portfolio: z.string().optional(),
  passwordOption: z.enum(passwordOptionEnum),
  password: z.string().optional(),
  sendCredentials: z.boolean(),
});

// ============================================
// REQUEST SCHEMAS - UPDATE
// ============================================
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
  adresse: adresseSchema.optional(),
  iban: z
    .string()
    .regex(/^[A-Z]{2}\d{2}[A-Z0-9]+$/)
    .optional(),
  notfallkontakt: notfallkontaktSchema.optional(),
});

// ============================================
// REQUEST SCHEMAS - EDIT FORMS
// ============================================
export const editBasicInfoSchema = z.object({
  vorname: z.string().min(2, 'Mindestens 2 Zeichen'),
  nachname: z.string().min(2, 'Mindestens 2 Zeichen'),
  email: z.string().email('Ungültige E-Mail-Adresse'),
  mitgliedsnummer: z.string().min(1, 'Mitgliedsnummer erforderlich'),
  geburtsdatum: z.string().optional(),
  istAktiv: z.boolean(),
});

export const editContactSchema = z.object({
  telefon: z
    .string()
    .regex(/^[\d\s\-+()]*$/, 'Ungültiges Telefonformat')
    .optional(),
  adresse: adresseSchema.optional(),
  notfallkontakt: notfallkontaktSchema.optional(),
  sichtbarkeit: sichtbarkeitSchema,
});

// ============================================
// REQUEST SCHEMAS - OTHER
// ============================================
export const assignRoleSchema = z.object({
  rolle: z.enum(memberRoleEnum),
  gueltigBis: z.string().optional(),
  begruendung: z.string().min(10),
});

export const setPasswordSchema = z.object({
  generateTemporary: z.boolean().optional(),
  password: z.string().optional(),
  sendEmail: z.boolean().optional(),
});

export const memberFilterSchema = z.object({
  active: z.boolean().optional(),
  search: z.string().optional(),
  roleId: z.enum(memberRoleEnum).optional(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),
});

// ============================================
// RESPONSE SCHEMAS
// ============================================
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

export const createLocalMemberResponseSchema = z.object({
  success: z.boolean(),
  data: z
    .object({
      memberId: z.string(),
      userId: z.string(),
      temporaryPassword: z.string().optional(),
    })
    .optional(),
  error: z.string().optional(),
});

export const setPasswordResponseSchema = z.object({
  success: z.boolean(),
  data: z
    .object({
      temporaryPassword: z.string().optional(),
    })
    .optional(),
  error: z.string().optional(),
});

// ============================================
// FORM SCHEMAS - Für UI Forms
// ============================================

// Basis Member Form Schema
export const memberFormSchema = z
  .object({
    // Common fields
    vorname: z.string().min(1, 'Vorname ist erforderlich'),
    nachname: z.string().min(1, 'Nachname ist erforderlich'),
    email: z.string().email('Ungültige E-Mail-Adresse'),
    telefon: z.string().optional(),

    // Create mode fields (optional für edit mode)
    memberType: z.enum(['member', 'creator', 'sponsor', 'partner']).optional(),
    passwordOption: z.enum(['none', 'generate', 'manual']).optional(),
    sendCredentials: z.boolean().optional(),
    kuenstlername: z.string().optional(),
    portfolio: z.string().url('Ungültige URL').optional().or(z.literal('')),
    password: z.string().min(8, 'Mindestens 8 Zeichen').optional(),

    // Edit mode fields
    geburtsdatum: z.string().optional(),
    mitgliedsnummer: z.string().optional(),
    istAktiv: z.boolean().optional(),
    adresse: adresseSchema.optional(),
    sichtbarkeit: sichtbarkeitSchema.optional(),
    notfallkontakt: notfallkontaktSchema.optional(),
    iban: z
      .string()
      .regex(/^[A-Z]{2}\d{2}[A-Z0-9]+$/, 'Ungültige IBAN')
      .optional(),
  })
  .refine(
    data => {
      // Validierung für Create Mode
      if (data.memberType) {
        if (data.memberType === 'creator' && !data.kuenstlername) {
          return false;
        }
        if (data.passwordOption === 'manual' && !data.password) {
          return false;
        }
      }
      return true;
    },
    {
      message: 'Bitte alle Pflichtfelder ausfüllen',
    }
  );

// Separate Sub-Schemas für Form-Sections
export const memberBasicInfoSchema = z.object({
  vorname: z.string().min(1, 'Vorname ist erforderlich'),
  nachname: z.string().min(1, 'Nachname ist erforderlich'),
  email: z.string().email('Ungültige E-Mail-Adresse'),
  mitgliedsnummer: z.string().optional(),
  geburtsdatum: z.string().optional(),
  istAktiv: z.boolean().optional(),
});

export const memberContactSchema = z.object({
  telefon: z.string().optional(),
  adresse: adresseSchema.optional(),
  notfallkontakt: notfallkontaktSchema.optional(),
  sichtbarkeit: sichtbarkeitSchema,
});

export const memberCreatorSchema = z.object({
  kuenstlername: z.string().min(1, 'Künstlername erforderlich'),
  portfolio: z.string().url('Ungültige URL').optional(),
});

export const memberLoginSchema = z.object({
  passwordOption: z.enum(['none', 'generate', 'manual']),
  password: z.string().min(8, 'Mindestens 8 Zeichen').optional(),
  sendCredentials: z.boolean().default(false),
});

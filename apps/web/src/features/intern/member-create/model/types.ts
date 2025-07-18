// apps/web/src/features/intern/member-create/model/types.ts
import { z } from 'zod';

export const createMemberSchema = z.object({
  memberType: z.enum(['creator', 'sponsor', 'partner']),
  vorname: z.string().min(2, 'Mindestens 2 Zeichen'),
  nachname: z.string().min(2, 'Mindestens 2 Zeichen'),
  email: z.string().email('Ungültige E-Mail-Adresse'),
  telefon: z.string().optional(),
  kuenstlername: z.string().optional(),
  portfolio: z.string().optional(),
  passwordOption: z.enum(['none', 'generate', 'manual']),
  password: z.string().optional(),
  sendCredentials: z.boolean(),
});

export type CreateMemberFormData = z.infer<typeof createMemberSchema>;

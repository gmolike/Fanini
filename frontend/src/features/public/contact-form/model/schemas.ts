// frontend/src/features/public/contact-form/model/schemas.ts
import { z } from 'zod';

import { RECIPIENT_TYPE_CONFIG } from './types';

export const contactFormSchema = z
  .object({
    // Standard fields
    firstName: z.string().min(2, 'Vorname muss mindestens 2 Zeichen haben'),
    lastName: z.string().min(2, 'Nachname muss mindestens 2 Zeichen haben'),
    email: z.string().email('Bitte gib eine gültige E-Mail-Adresse ein'),
    phone: z.string().optional(),

    // Recipient selection
    recipientType: z.enum(['general', 'team', 'committee']),

    // Conditional fields
    selectedTeam: z.enum(['events', 'media', 'club', 'tech']).optional(),
    selectedCommittee: z.enum(['board', 'advisory']).optional(),

    // Message fields
    subject: z.string().min(5, 'Betreff muss mindestens 5 Zeichen haben'),
    message: z.string().min(20, 'Nachricht muss mindestens 20 Zeichen haben'),
    detailedDescription: z.string().optional(),

    // Consent
    privacyConsent: z.boolean().refine(val => val, {
      message: 'Du musst der Datenschutzerklärung zustimmen',
    }),
  })
  .superRefine((data, ctx) => {
    const recipientConfig = RECIPIENT_TYPE_CONFIG[data.recipientType];

    if (recipientConfig.requiresDetail) {
      // Check if sub-type is selected
      if (data.recipientType === 'team' && !data.selectedTeam) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Bitte wähle ein Team aus',
          path: ['selectedTeam'],
        });
      }

      if (data.recipientType === 'committee' && !data.selectedCommittee) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Bitte wähle ein Gremium aus',
          path: ['selectedCommittee'],
        });
      }

      // Check detailed description
      const minLength = recipientConfig.minDetailLength;
      if (!data.detailedDescription || data.detailedDescription.length < minLength) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Die detaillierte Beschreibung muss mindestens ${String(minLength)} Zeichen lang sein`,
          path: ['detailedDescription'],
        });
      }
    }
  });

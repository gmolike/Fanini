// frontend/src/features/settings/UpdateBranding/model/validation.ts
import { z } from 'zod';

// Erweiterte Validierung für Formulare
export const brandingFormSchema = z.object({
  colors: z.object({
    primary: z.string().regex(/^#[0-9A-F]{6}$/i, 'Bitte gültigen Hex-Code eingeben (#RRGGBB)'),
    secondary: z.string().regex(/^#[0-9A-F]{6}$/i, 'Bitte gültigen Hex-Code eingeben (#RRGGBB)'),
    accent: z
      .string()
      .regex(/^#[0-9A-F]{6}$/i, 'Bitte gültigen Hex-Code eingeben (#RRGGBB)')
      .optional()
      .or(z.literal('')),
  }),
  logo: z.object({
    url: z.string().min(1, 'Logo URL ist erforderlich'),
    alt: z.string().min(1, 'Alt-Text ist erforderlich für Barrierefreiheit'),
  }),
});

export type BrandingFormData = z.infer<typeof brandingFormSchema>;

import { z } from 'zod';

// Base Schemas
export const emailSchema = z.string().email('Ungültige E-Mail-Adresse');
export const passwordSchema = z.string().min(8, 'Mindestens 8 Zeichen');

// Form Schemas
export const loginFormSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  remember: z.boolean().optional(),
});

export const nameSchema = z.string().min(2, 'Mindestens 2 Zeichen');

export const signupFormSchema = z
  .object({
    name: nameSchema,
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Passwörter stimmen nicht überein',
    path: ['confirmPassword'],
  });

export const userFormSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  role: z.enum(['member', 'admin', 'moderator']),
  bio: z.string().max(500).optional(),
});

// Type Exports
export type LoginFormData = z.infer<typeof loginFormSchema>;
export type SignupFormData = z.infer<typeof signupFormSchema>;
export type UserFormData = z.infer<typeof userFormSchema>;

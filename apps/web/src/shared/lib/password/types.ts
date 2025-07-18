// apps/web/src/shared/lib/password/types.ts
export type PasswordStrength = 'weak' | 'medium' | 'strong';

export type PasswordValidationResult = {
  strength: PasswordStrength;
  errors: string[];
};

/* eslint-disable sonarjs/pseudo-random */
// apps/web/src/shared/lib/password/utils.ts
import type { PasswordStrength, PasswordValidationResult } from './types';

/**
 * Adjektive und Substantive für Password-Generator
 */
const ADJECTIVES = [
  'Schneller',
  'Mutiger',
  'Kluger',
  'Starker',
  'Wilder',
  'Goldener',
  'Silberner',
  'Flinker',
  'Tapferer',
  'Stolzer',
] as const;

const NOUNS = [
  'Adler',
  'Tiger',
  'Löwe',
  'Falke',
  'Wolf',
  'Drache',
  'Phönix',
  'Panther',
  'Bär',
  'Hai',
] as const;

/**
 * Generiert ein temporäres Passwort
 * @returns Passwort im Format Adjektiv-Substantiv-Zahl
 */
export const generateTemporaryPassword = (): string => {
  const adjective = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)] as string;
  const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)] as string;
  const number = Math.floor(Math.random() * 9000) + 1000;

  return `${adjective}-${noun}-${number.toString()}`;
};

/**
 * Validiert ein Passwort gegen die Policy
 * @param password - Das zu validierende Passwort
 * @returns Validierungsergebnis mit Stärke und Fehlern
 */
export const validatePassword = (password: string): PasswordValidationResult => {
  const errors: string[] = [];
  let score = 0;

  if (password.length >= 8) {
    score++;
  } else {
    errors.push('Mindestens 8 Zeichen');
  }

  if (/[A-Z]/.test(password)) {
    score++;
  } else {
    errors.push('Mindestens ein Großbuchstabe');
  }

  if (/[a-z]/.test(password)) {
    score++;
  } else {
    errors.push('Mindestens ein Kleinbuchstabe');
  }

  if (/\d/.test(password)) {
    score++;
  } else {
    errors.push('Mindestens eine Zahl');
  }

  if (/[^A-Za-z0-9]/.test(password)) {
    score++;
  }

  const prohibited = ['123', 'password', 'fanini'] as const;
  for (const pattern of prohibited) {
    if (password.toLowerCase().includes(pattern)) {
      errors.push(`Darf nicht "${pattern}" enthalten`);
      score = Math.max(0, score - 1);
    }
  }

  // eslint-disable-next-line sonarjs/no-hardcoded-passwords
  let strength: PasswordStrength = 'weak';
  if (score >= 4) strength = 'strong';
  else if (score >= 3) strength = 'medium';

  return { strength, errors };
};

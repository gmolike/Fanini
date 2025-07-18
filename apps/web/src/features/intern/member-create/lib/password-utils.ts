// apps/web/src/features/intern/member-create/lib/password-utils.ts

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
];

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
];

/**
 * Generiert ein temporäres Passwort im Format Adjektiv-Substantiv-Zahl
 */
export const generateTemporaryPassword = (): string => {
  const adjective = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
  const number = Math.floor(Math.random() * 9000) + 1000;

  return `${adjective}-${noun}-${number}`;
};

type PasswordStrength = 'weak' | 'medium' | 'strong';

type PasswordValidationResult = {
  strength: PasswordStrength;
  errors: string[];
};

/**
 * Validiert ein Passwort gegen die Policy
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

  if (/[0-9]/.test(password)) {
    score++;
  } else {
    errors.push('Mindestens eine Zahl');
  }

  if (/[^A-Za-z0-9]/.test(password)) {
    score++;
  }

  // Verbotene Muster
  const prohibited = ['123', 'password', 'fanini'];
  for (const pattern of prohibited) {
    if (password.toLowerCase().includes(pattern)) {
      errors.push(`Darf nicht "${pattern}" enthalten`);
      score = Math.max(0, score - 1);
    }
  }

  let strength: PasswordStrength = 'weak';
  if (score >= 4) strength = 'strong';
  else if (score >= 3) strength = 'medium';

  return { strength, errors };
};

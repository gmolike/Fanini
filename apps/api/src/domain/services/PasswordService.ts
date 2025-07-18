// apps/api/src/domain/services/PasswordService.ts
import bcrypt from 'bcrypt';

/**
 * Password Service
 * @description Handles password hashing, validation and generation
 */
export type PasswordService = {
  /**
   * Hashes a password
   */
  hash: (password: string) => Promise<string>;

  /**
   * Verifies a password against a hash
   */
  verify: (password: string, hash: string) => Promise<boolean>;

  /**
   * Generates a temporary password
   */
  generateTemporary: () => string;

  /**
   * Validates password against policy
   */
  validatePolicy: (password: string) => PasswordValidationResult;
};

export type PasswordValidationResult = {
  isValid: boolean;
  errors: string[];
};

const BCRYPT_ROUNDS = 12;

// Adjektive und Substantive für Password-Generator
const ADJECTIVES = [
  'Schneller', 'Mutiger', 'Kluger', 'Starker', 'Wilder',
  'Goldener', 'Silberner', 'Flinker', 'Tapferer', 'Stolzer'
];

const NOUNS = [
  'Adler', 'Tiger', 'Löwe', 'Falke', 'Wolf',
  'Drache', 'Phönix', 'Panther', 'Bär', 'Hai'
];

export const createPasswordService = (): PasswordService => ({
  hash: async (password: string): Promise<string> => {
    return bcrypt.hash(password, BCRYPT_ROUNDS);
  },

  verify: async (password: string, hash: string): Promise<boolean> => {
    return bcrypt.compare(password, hash);
  },

  generateTemporary: (): string => {
    const adjective = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
    const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
    const number = Math.floor(Math.random() * 9000) + 1000;

    return `${adjective}-${noun}-${number}`;
  },

  validatePolicy: (password: string): PasswordValidationResult => {
    const errors: string[] = [];

    if (password.length < 8) {
      errors.push('Passwort muss mindestens 8 Zeichen lang sein');
    }

    if (!/[A-Z]/.test(password)) {
      errors.push('Passwort muss mindestens einen Großbuchstaben enthalten');
    }

    if (!/[a-z]/.test(password)) {
      errors.push('Passwort muss mindestens einen Kleinbuchstaben enthalten');
    }

    if (!/[0-9]/.test(password)) {
      errors.push('Passwort muss mindestens eine Zahl enthalten');
    }

    // Verbotene Muster
    const prohibited = ['123', 'password', 'fanini'];
    for (const pattern of prohibited) {
      if (password.toLowerCase().includes(pattern)) {
        errors.push(`Passwort darf nicht "${pattern}" enthalten`);
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
});

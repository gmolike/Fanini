import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Kombiniert Tailwind CSS Klassen mit Konfliktauflösung
 * @param inputs - CSS Klassen
 * @returns Kombinierte CSS Klassen
 */
export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs))
}

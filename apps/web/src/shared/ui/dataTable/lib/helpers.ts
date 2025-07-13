/**
 * @module dataTable/helpers
 * @description Hilfs-Funktionen für DataTable
 */

import type { TableDataConstraint } from '../model/types';

/**
 * Erstellt Skeleton-Daten für Loading States
 *
 * @description Generiert ein Array mit Dummy-Daten für die Skeleton-Darstellung
 *
 * @template TData - Datentyp der Tabellenzeilen
 * @param count - Anzahl der zu generierenden Zeilen
 * @returns Array mit Skeleton-Daten
 *
 * @example
 * ```tsx
 * const skeletonData = createSkeletonData<User>(5);
 * ```
 */
export const createSkeletonData = <TData extends TableDataConstraint>(count: number): TData[] =>
  Array.from(
    { length: count },
    (_, index) => ({ id: `skeleton-${String(index)}` }) as unknown as TData
  );

/**
 * Debounce Funktion für Suche
 *
 * @description Verzögert die Ausführung einer Funktion
 *
 * @param func - Zu verzögernde Funktion
 * @param wait - Wartezeit in Millisekunden
 * @returns Debounced Funktion
 */
export const debounce = <T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

/**
 * Formatiert Column Labels
 *
 * @description Konvertiert camelCase Keys zu lesbaren Labels falls kein explizites Label vorhanden
 *
 * @param labels - Label-Objekt
 * @returns Formatierte Labels
 *
 * @example
 * ```tsx
 * const labels = formatColumnLabels({
 *   firstName: 'Vorname',
 *   lastName: '', // wird zu "Last Name"
 *   emailAddress: undefined // wird zu "Email Address"
 * });
 * ```
 */
export const formatColumnLabels = (
  labels: Record<string, string | undefined>
): Record<string, string> => {
  const formatted: Record<string, string> = {};

  Object.entries(labels).forEach(([key, value]) => {
    if (!value) {
      // CamelCase zu Title Case
      formatted[key] = key
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, str => str.toUpperCase())
        .trim();
    } else {
      formatted[key] = value;
    }
  });

  return formatted;
};

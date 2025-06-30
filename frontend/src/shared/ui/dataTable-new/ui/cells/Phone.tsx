/**
 * @module dataTable/cells/Phone
 * @description Phone Cell Component mit Formatierung
 */

import { Phone as PhoneDisplay } from '@/shared/ui/display/Phone';

import type { CellProps } from '../../model/types';

/**
 * Phone Cell Component
 *
 * @description Formatiert Telefonnummern für bessere Lesbarkeit
 *
 * @param props - Cell Properties
 * @returns Rendered phone cell
 *
 * @example
 * ```tsx
 * { id: 'phone', cell: Phone }
 * ```
 */
export const Phone = <TData,>({ value }: CellProps<TData>) => (
  <PhoneDisplay phone={value as string | null | undefined} />
);

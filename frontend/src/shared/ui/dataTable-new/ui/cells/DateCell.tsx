/**
 * @module dataTable/cells/Date
 * @description Date Cell Component mit Formatierung
 */

import { DateDisplay } from '@/shared/ui/display';

import type { CellProps } from '../../model/types';

/**
 * Date Cell Component
 *
 * @description Formatiert und zeigt Datumswerte in einem einheitlichen Format
 *
 * @param props - Cell Properties
 * @returns Rendered date cell
 *
 * @example
 * ```tsx
 * { id: 'createdAt', cell: Date }
 * ```
 */
export const DateCell = <TData,>({ value }: CellProps<TData>) => (
  <DateDisplay date={(value as string | Date | number | null) ?? null} />
);

/**
 * @module dataTable/cells/Boolean
 * @description Boolean Cell Component mit Icon-Darstellung
 */

import { BooleanDisplay } from '@/shared/ui/display';

import type { CellProps } from '../../model/types';

/**
 * Boolean Cell Component
 *
 * @description Zeigt Boolean-Werte als Icon (Checkmark/X) an
 *
 * @param props - Cell Properties
 * @returns Rendered boolean cell
 *
 * @example
 * ```tsx
 * { id: 'isActive', cell: Boolean }
 * ```
 */
export const BooleanCell = <TData,>({ value }: CellProps<TData>) => (
  <BooleanDisplay value={value as boolean} />
);

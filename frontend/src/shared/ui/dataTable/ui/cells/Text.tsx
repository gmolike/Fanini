/**
 * @module dataTable/cells/Text
 * @description Standard Text Cell Component
 */

import { Text as TextDisplay } from '@/shared/ui/display/Text';

import type { CellProps } from '../../model/types';

/**
 * Text Cell Component
 *
 * @description Rendert Text-Inhalte in Tabellenzellen mit automatischem Null-Handling
 *
 * @param props - Cell Properties
 * @returns Rendered text cell
 *
 * @example
 * ```tsx
 * { id: 'name', cell: Text }
 * ```
 */
export const Text = <TData,>({ value }: CellProps<TData>) => (
  <TextDisplay text={value === undefined ? null : (value as string | number | null)} />
);

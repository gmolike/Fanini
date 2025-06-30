/**
 * @module dataTable/cells/Text
 * @description Standard Text Cell Component
 */

import { TextDisplay } from '@/shared/ui/display';

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
  <TextDisplay text={value as string | undefined | null} />
);

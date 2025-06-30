/**
 * @module dataTable/cells/Email
 * @description Email Cell Component mit Icon
 */

import { EmailDisplay } from '@/shared/ui/display';

import type { CellProps } from '../../model/types';

/**
 * Email Cell Component
 *
 * @description Zeigt E-Mail-Adressen mit Mail-Icon an
 *
 * @param props - Cell Properties
 * @returns Rendered email cell
 *
 * @example
 * ```tsx
 * { id: 'email', cell: Email }
 * ```
 */
export const Email = <TData,>({ value }: CellProps<TData>) => (
  <EmailDisplay email={value === undefined ? null : (value as string)} withIcon />
);

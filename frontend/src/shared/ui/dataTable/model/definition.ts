/**
 * @module dataTable/definition
 * @description Factory Functions für Type-Safe Table Definitions
 */

import type { TableDefinition } from './types';

/**
 * Erstellt eine typsichere TableDefinition
 *
 * @description Factory Function die TypeScript bei der korrekten Type-Inference unterstützt
 * und sicherstellt, dass Labels und Fields konsistent sind.
 *
 * @template TData - Der Datentyp der Tabellenzeilen
 * @param definition - Die Table Definition
 * @returns Die unveränderte Definition mit korrekter Typisierung
 *
 * @example
 * ```typescript
 * type User = {
 *   id: string;
 *   name: string;
 *   email: string;
 *   role: 'admin' | 'user';
 * };
 *
 * const userTable = createTableDefinition<User>({
 *   labels: {
 *     name: 'Name',
 *     email: 'E-Mail',
 *     role: 'Rolle',
 *     actions: 'Aktionen'
 *   },
 *   fields: [
 *     { id: 'name', sortable: true, searchable: true },
 *     { id: 'email', cell: EmailCell },
 *     { id: 'role', cell: RoleBadge },
 *     { id: 'actions', cell: 'actions' }
 *   ]
 * });
 * ```
 */
export const createTableDefinition = <TData>(
  definition: TableDefinition<TData>
): TableDefinition<TData> => definition;

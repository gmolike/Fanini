/**
 * @module dataTable/cells/Actions
 * @description Actions Cell Component für Edit/Delete Buttons
 */

import { Delete } from '../buttons/Delete';
import { Edit } from '../buttons/Edit';

/**
 * Actions Cell Props
 */
type ActionsProps<TData> = {
  row: TData;
  onEdit?: (row: TData) => void;
  onDelete?: (row: TData) => void;
};

/**
 * Actions Cell Component
 *
 * @description Rendert Action-Buttons (Edit/Delete) für Tabellenzeilen
 *
 * @param props - Actions Properties
 * @returns Rendered action buttons
 *
 * @example
 * ```tsx
 * { id: 'actions', cell: 'actions' }
 * ```
 */
export const Actions = <TData,>({ row, onEdit, onDelete }: ActionsProps<TData>) => (
  <div className="flex items-center gap-2">
    {onEdit ? (
      <Edit
        onClick={() => {
          onEdit(row);
        }}
      />
    ) : null}
    {onDelete ? (
      <Delete
        onClick={() => {
          onDelete(row);
        }}
      />
    ) : null}
  </div>
);

/**
 * @module dataTable/buttons/Delete
 * @description Delete Button für Tabellen-Aktionen
 */

import { Trash2 } from 'lucide-react';

import { Button } from '@/shared/shadcn';

/**
 * Delete Button Props
 */
type DeleteProps = {
  onClick: (e: React.MouseEvent) => void;
  label?: string;
};

/**
 * Delete Button Component
 *
 * @description Icon-Button zum Löschen von Tabellenzeilen
 *
 * @param props - Button Properties
 * @returns Rendered delete button
 */
export const Delete = ({ onClick, label = 'Löschen' }: DeleteProps) => (
  <Button
    variant="ghost"
    size="icon"
    onClick={e => {
      e.stopPropagation();
      onClick(e);
    }}
    title={label}
    className="text-destructive hover:bg-destructive/10"
  >
    <Trash2 className="size-4" />
  </Button>
);

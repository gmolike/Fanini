/**
 * @module dataTable/buttons/Edit
 * @description Edit Button für Tabellen-Aktionen
 */

import { Edit as EditIcon } from 'lucide-react';

import { Button } from '@/shared/shadcn';

/**
 * Edit Button Props
 */
type EditProps = {
  onClick: (e: React.MouseEvent) => void;
  label?: string;
};

/**
 * Edit Button Component
 *
 * @description Icon-Button zum Bearbeiten von Tabellenzeilen
 *
 * @param props - Button Properties
 * @returns Rendered edit button
 */
export const Edit = ({ onClick, label = 'Bearbeiten' }: EditProps) => (
  <Button
    variant="ghost"
    size="icon"
    onClick={e => {
      e.stopPropagation();
      onClick(e);
    }}
    title={label}
  >
    <EditIcon className="size-4" />
  </Button>
);

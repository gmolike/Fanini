/**
 * @module dataTable/buttons/CompactDelete
 * @description Kompakter Delete Button mit Text
 */

import { Button } from '@/shared/shadcn';

/**
 * Compact Delete Button Props
 */
type CompactDeleteProps = {
  onClick: () => void;
  label?: string;
};

/**
 * Compact Delete Button Component
 *
 * @description Text-basierter Delete Button für Detail-Seiten
 *
 * @param props - Button Properties
 * @returns Rendered compact delete button
 */
export const CompactDelete = ({ onClick, label = 'Löschen' }: CompactDeleteProps) => (
  <Button variant="destructive" size="sm" onClick={onClick}>
    {label}
  </Button>
);

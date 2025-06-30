/**
 * @module dataTable/parts/ExpandButton
 * @description Expand/Collapse Button für erweiterbate Tabellen
 */

import { ChevronDown, ChevronUp } from 'lucide-react';

import { Button } from '@/shared/shadcn';

import type { ExpandButtonProps } from '../../model/types';

/**
 * Expand Button Component
 *
 * @description Button zum Erweitern/Reduzieren der Tabellenansicht
 *
 * @param props - Expand Button Properties
 * @returns Rendered expand button
 */
export const ExpandButton = ({
  isExpanded,
  onToggle,
  collapsedCount,
  totalCount,
  customText,
}: ExpandButtonProps) => {
  if (totalCount <= collapsedCount) return null;

  const expandText = customText?.expand ?? `Alle ${String(totalCount)} Einträge anzeigen`;
  const collapseText = customText?.collapse ?? 'Weniger anzeigen';

  return (
    <div className="flex justify-center border-t py-4">
      <Button variant="ghost" onClick={onToggle} className="gap-2">
        {isExpanded ? (
          <>
            <ChevronUp className="size-4" />
            {collapseText}
          </>
        ) : (
          <>
            <ChevronDown className="size-4" />
            {expandText}
          </>
        )}
      </Button>
    </div>
  );
};

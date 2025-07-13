/**
 * @module dataTable/headers/Sortable
 * @description Sortierbarer Header mit Indikator
 */

import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';

import { Button } from '@/shared/shadcn';

import type { Column } from '@tanstack/react-table';

/**
 * Sortable Header Props
 */
type SortableProps<TData> = {
  label: string;
  column: Column<TData>;
};

/**
 * Sortable Header Component
 *
 * @description Header mit Sortier-Funktionalität und visuellen Indikatoren
 *
 * @param props - Header Properties
 * @returns Rendered sortable header
 */
export const Sortable = <TData,>({ label, column }: SortableProps<TData>) => {
  const isSorted = column.getIsSorted();

  return (
    <Button
      variant="ghost"
      onClick={() => {
        column.toggleSorting(column.getIsSorted() === 'asc');
      }}
      className="-ml-3 h-8 text-xs font-medium tracking-wider uppercase hover:bg-transparent"
    >
      {label}
      {isSorted === 'asc' && <ArrowUp className="ml-2 size-4" />}
      {isSorted === 'desc' && <ArrowDown className="ml-2 size-4" />}
      {isSorted === false && <ArrowUpDown className="ml-2 size-4 opacity-50" />}
    </Button>
  );
};

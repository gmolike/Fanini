/**
 * @module dataTable/parts/Pagination
 * @description Pagination Controls für Tabellen
 */

import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

import {
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/shadcn';

import type { PaginationProps } from '../../model/types';

/**
 * Pagination Component
 *
 * @description Steuert die Seitennavigation und Anzahl der Einträge pro Seite
 *
 * @param props - Pagination Properties
 * @returns Rendered pagination controls
 */
export const Pagination = <TData,>({ table }: PaginationProps<TData>) => (
  <div className="flex items-center justify-between px-2">
    <div className="flex items-center space-x-4">
      <div className="text-muted-foreground text-sm">
        Seite {table.getState().pagination.pageIndex + 1} von {table.getPageCount()}
      </div>
      <div className="flex items-center space-x-2">
        <p className="text-sm font-medium">Zeilen pro Seite</p>
        <Select
          value={String(table.getState().pagination.pageSize)}
          onValueChange={value => {
            table.setPageSize(Number(value));
          }}
        >
          <SelectTrigger className="h-8 w-[70px]">
            <SelectValue placeholder={table.getState().pagination.pageSize} />
          </SelectTrigger>
          <SelectContent side="top">
            {[10, 20, 30, 50, 100].map(pageSize => (
              <SelectItem key={pageSize} value={String(pageSize)}>
                {pageSize}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>

    <div className="flex items-center space-x-2">
      <Button
        variant="outline"
        className="size-8 p-0"
        onClick={() => {
          table.setPageIndex(0);
        }}
        disabled={!table.getCanPreviousPage()}
      >
        <span className="sr-only">Zur ersten Seite</span>
        <ChevronsLeft className="size-4" />
      </Button>
      <Button
        variant="outline"
        className="size-8 p-0"
        onClick={() => {
          table.previousPage();
        }}
        disabled={!table.getCanPreviousPage()}
      >
        <span className="sr-only">Vorherige Seite</span>
        <ChevronLeft className="size-4" />
      </Button>
      <Button
        variant="outline"
        className="size-8 p-0"
        onClick={() => {
          table.nextPage();
        }}
        disabled={!table.getCanNextPage()}
      >
        <span className="sr-only">Nächste Seite</span>
        <ChevronRight className="size-4" />
      </Button>
      <Button
        variant="outline"
        className="size-8 p-0"
        onClick={() => {
          table.setPageIndex(table.getPageCount() - 1);
        }}
        disabled={!table.getCanNextPage()}
      >
        <span className="sr-only">Zur letzten Seite</span>
        <ChevronsRight className="size-4" />
      </Button>
    </div>
  </div>
);

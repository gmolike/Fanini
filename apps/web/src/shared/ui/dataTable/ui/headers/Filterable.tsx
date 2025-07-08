/**
 * @module dataTable/headers/Filterable
 * @description Filter-Header mit Inline-Filter
 */

import { Filter } from 'lucide-react';

import { Button, Input, Popover, PopoverContent, PopoverTrigger } from '@/shared/shadcn';

import type { Column } from '@tanstack/react-table';

/**
 * Filterable Header Props
 */
type FilterableProps<TData> = {
  label: string;
  column: Column<TData>;
};

/**
 * Filterable Header Component
 *
 * @description Header mit integrierter Filter-Funktionalität über Popover
 *
 * @param props - Header Properties
 * @returns Rendered filterable header
 */
export const Filterable = <TData,>({ label, column }: FilterableProps<TData>) => {
  const filterValue = column.getFilterValue();

  return (
    <div className="flex items-center space-x-2">
      <span className="text-xs font-medium tracking-wider uppercase">{label}</span>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon" className="size-6">
            <Filter className="size-3" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-56" align="start">
          <div className="space-y-2">
            <p className="text-sm font-medium">Filter {label}</p>
            <Input
              placeholder={`Filter ${label}...`}
              value={typeof filterValue === 'string' ? filterValue : ''}
              onChange={e => { column.setFilterValue(e.target.value); }}
              className="h-8"
            />
            {(typeof filterValue === 'string' && filterValue !== '') ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => { column.setFilterValue(undefined); }}
                className="w-full"
              >
                Clear
              </Button>
            ) : null}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

/**
 * @module dataTable/parts/Toolbar
 * @description Toolbar mit Suche und Aktionen
 */

import { Info, Plus, Settings2, X } from 'lucide-react';

import {
  Button,
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Input,
} from '@/shared/shadcn';

import type { ToolbarProps } from '../../model/types';

/**
 * Toolbar Component
 *
 * @description Obere Steuerleiste mit Suche, Spaltenauswahl und Aktionen
 *
 * @param props - Toolbar Properties
 * @returns Rendered toolbar
 */
export const Toolbar = <TData,>({
  table,
  searchPlaceholder = 'Suche...',
  columnLabels = {},
  showColumnToggle = true,
  showColumnToggleText = false,
  onAddClick,
  addButtonText,
  addButtonTitle,
  globalFilter,
  onGlobalFilterChange,
  tableDefinition,
  disabledColumns,
  serverSide,
}: ToolbarProps<TData>) => {
  const isFiltered = table.getState().columnFilters.length > 0 || !!globalFilter;

  const isColumnToggleable = (columnId: string): boolean => {
    if (disabledColumns?.includes(columnId)) return false;
    if (columnId === 'actions') return false;

    const field = tableDefinition?.fields.find(f => f.id === columnId);
    return field?.toggleable !== false;
  };

  const getColumnLabel = (columnId: string): string => columnLabels[columnId] ?? columnId;

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        {onGlobalFilterChange ? (
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <Input
                placeholder={searchPlaceholder}
                value={globalFilter ?? ''}
                onChange={event => {
                  onGlobalFilterChange(event.target.value);
                }}
                className="h-8 w-[200px] lg:w-[300px]"
              />
              {isFiltered ? (
                <Button
                  variant="ghost"
                  onClick={() => {
                    table.resetColumnFilters();
                    table.resetGlobalFilter();
                    onGlobalFilterChange('');
                  }}
                  className="h-8 px-2 lg:px-3"
                >
                  Zurücksetzen
                  <X className="ml-2 size-4" />
                </Button>
              ) : null}
            </div>

            {/* Server-Side Search Info */}
            {serverSide?.enabled &&
            serverSide.searchableFields &&
            serverSide.searchableFields.length > 0 ? (
              <div className="text-muted-foreground flex items-start gap-1 text-xs">
                <Info className="mt-0.5 size-3 flex-shrink-0" />
                <div>
                  <p>Die Suche wird im Backend durchgeführt.</p>
                  <p>Folgende Felder werden gefiltert: {serverSide.searchableFields.join(', ')}</p>
                </div>
              </div>
            ) : null}
          </div>
        ) : null}
      </div>

      <div className="flex items-center space-x-2">
        {onAddClick ? (
          <Button
            variant="outline"
            size="sm"
            className="h-8"
            title={addButtonTitle}
            onClick={onAddClick}
          >
            <Plus className={addButtonText ? 'mr-2 size-4' : 'size-4'} />
            {addButtonText}
          </Button>
        ) : null}

        {showColumnToggle ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8">
                <Settings2 className={showColumnToggleText ? 'mr-2 size-4' : 'size-4'} />
                {showColumnToggleText ? 'Spalten' : null}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              <DropdownMenuLabel>Sichtbare Spalten</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {table
                .getAllColumns()
                .filter(column => column.getCanHide())
                .map(column => {
                  const columnId = column.id;
                  const isToggleable = isColumnToggleable(columnId);

                  return (
                    <DropdownMenuCheckboxItem
                      key={columnId}
                      checked={column.getIsVisible()}
                      onCheckedChange={value => {
                        if (isToggleable) {
                          column.toggleVisibility(!!value);
                        }
                      }}
                      onSelect={e => {
                        e.preventDefault();
                      }}
                      disabled={!isToggleable}
                      className={!isToggleable ? 'cursor-not-allowed opacity-50' : ''}
                    >
                      {getColumnLabel(columnId)}
                      {!isToggleable && (
                        <span className="text-muted-foreground ml-2 text-xs">(fixiert)</span>
                      )}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        ) : null}
      </div>
    </div>
  );
};

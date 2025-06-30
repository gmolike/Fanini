import { Plus, Settings2, X } from 'lucide-react';

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

import type { ToolbarProps } from '../types';

/**
 * Toolbar für DataTable mit Suche und Aktionen
 *
 * @component
 * @param props - Toolbar Konfiguration
 */
export const TableToolbar = <TData,>({
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
}: ToolbarProps<TData>) => {
  const isFiltered = table.getState().columnFilters.length > 0 || !!globalFilter;

  const isColumnToggleable = (columnId: string): boolean => {
    return !(
      disabledColumns?.includes(columnId) ??
      (tableDefinition?.fields.find(f => f.id === columnId)?.toggelable === false ||
        columnId === 'actions')
    );
  };

  /**
   * Holt das Label für eine Spalte
   */
  const getColumnLabel = (columnId: string): string => columnLabels[columnId] ?? columnId;

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        {onGlobalFilterChange ? (
          <>
            <Input
              placeholder={searchPlaceholder}
              value={globalFilter ?? ''}
              onChange={(event: { target: { value: string } }) => {
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
          </>
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
                      disabled={!isToggleable} // ← NEU
                      className={!isToggleable ? 'cursor-not-allowed opacity-50' : ''} // ← NEU
                    >
                      {getColumnLabel(columnId)}
                      {!isToggleable && (
                        <span className="text-muted-foreground ml-2 text-xs">(fixiert)</span>
                      )}{' '}
                      {/* ← NEU */}
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

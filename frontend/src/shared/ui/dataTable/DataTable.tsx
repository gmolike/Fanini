/* eslint-disable complexity */
import { useEffect, useMemo, useRef, useState } from 'react';

import {
type  ColumnFiltersState,  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
type  SortingState,  useReactTable,
type  VisibilityState } from '@tanstack/react-table';

import { cn } from '@/shared/lib';
import {
  Card,
  CardContent,
  ShadCnTable,
  ShadCnTableBody,
  ShadCnTableCell,
  ShadCnTableHead,
  ShadCnTableHeader,
  ShadCnTableRow,
} from '@/shared/shadcn';

import { EmptyState } from './components/EmptyState';
import { ErrorState } from './components/ErrorState';
import { ExpandButton } from './components/ExpandButton';
import { TablePagination } from './components/TablePagination';
import { TableSkeleton } from './components/TableSkeleton';
import { TableToolbar } from './components/TableToolbar';
import {
  convertTableDefinition,
  getColumnVisibility,
  getSearchableColumns,
} from './model/TableConverter';

import type { DataTableProps, TableDefinition } from './model/tableDefinition';

/**
 * DataTable Component
 * @description Hauptkomponente für Tabellen - arbeitet ausschließlich mit TableDefinition
 * @param tableDefinition - Definition mit Labels und Fields
 * @param selectableColumns - Array der anzuzeigenden Spalten IDs (default: alle)
 * @param data - Daten-Array
 * @param idKey - Key für die ID (default: "id")
 * @param selectedId - ID der zu selektierenden Zeile
 * @example
 * ```tsx
 * <DataTable
 *   tableDefinition={teamTableDefinition}
 *   selectableColumns={['name', 'email', 'status']} // optional, type-safe!
 *   data={teamMembers}
 *   onRowClick={(member) => navigate(`/team/${member.id}`)}
 *   selectedId="123"
 *   idKey="id"
 * />
 * ```
 */
export const DataTable = <
  TData extends Record<string, unknown> = Record<string, unknown>,
  TTableDef extends TableDefinition<TData> = TableDefinition<TData>,
>({
  // Core Props
  tableDefinition,
  selectableColumns,
  disabledColumns,
  data,

  // State Props
  isLoading = false,
  error,

  // Callbacks
  onRowClick,
  onEdit,
  onDelete,
  onAdd,
  onRetry,

  // UI Options
  searchPlaceholder = 'Globale Suche...',
  addButtonText,
  addButtonTitle,
  showColumnToggle = true,
  showColumnToggleText = false,

  // Features
  expandable = false,
  initialRowCount = 5,
  expandButtonText,
  stickyHeader = false,
  stickyActionColumn = false,
  maxHeight,
  pageSize = 20,
  selectedRowId,
  selectedId,
  idKey = 'id',

  // Styling
  className,
  containerClassName,

  // Custom Components
  emptyStateComponent: EmptyStateComponent,
  errorStateComponent: ErrorStateComponent,
}: DataTableProps<TData, TTableDef>) => {
  // State
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [isExpanded, setIsExpanded] = useState(!expandable);
  const tableRef = useRef<HTMLDivElement>(null);

  // Verwende alle Spalten als Standard, wenn selectableColumns nicht angegeben
  const effectiveSelectableColumns = useMemo(
    () => selectableColumns ?? tableDefinition.fields.map(field => field.id),
    [selectableColumns, tableDefinition.fields]
  );

  // Convert TableDefinition to Columns
  const columns = useMemo(() => {
    const actions: { onEdit?: (row: TData) => void; onDelete?: (row: TData) => void } = {};
    if (onEdit) actions.onEdit = onEdit;
    if (onDelete) actions.onDelete = onDelete;
    return convertTableDefinition(tableDefinition, effectiveSelectableColumns, actions);
  }, [tableDefinition, effectiveSelectableColumns, onEdit, onDelete]);

  // Column Visibility
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(() =>
    getColumnVisibility(tableDefinition, effectiveSelectableColumns)
  );

  // Searchable Columns
  const searchableColumns = useMemo(() => getSearchableColumns(tableDefinition), [tableDefinition]);

  // Table Instance
  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      globalFilter,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    initialState: {
      pagination: {
        pageSize,
      },
    },
  });

  // Computed values
  const filteredRows = table.getFilteredRowModel().rows;
  const sortedRows = table.getSortedRowModel().rows;
  const filteredRowsCount = filteredRows.length;
  const paginatedRows = table.getPaginationRowModel().rows;

  // Display Rows berechnung - das ist der Kern der Logik
  const displayRows = useMemo(
    () => (expandable && !isExpanded ? sortedRows.slice(0, initialRowCount) : paginatedRows),
    [expandable, isExpanded, sortedRows, paginatedRows, initialRowCount]
  );

  const showExpandButton = expandable && filteredRowsCount > initialRowCount;

  // Effect für selectedId - scrollt zur ausgewählten Zeile
  useEffect(() => {
    if (selectedId && data.length > 0 && tableRef.current) {
      // Finde den Index der Zeile mit der selectedId
      const rowIndex = data.findIndex(row => row[idKey] == selectedId);

      if (rowIndex !== -1) {
        // Berechne auf welcher Seite die Zeile ist
        const pageIndex = Math.floor(rowIndex / table.getState().pagination.pageSize);

        // Setze die Pagination nur wenn nötig
        if (table.getState().pagination.pageIndex !== pageIndex) {
          table.setPageIndex(pageIndex);
        }

        // Wenn die Tabelle expandable ist und kollabiert, expandiere sie
        if (expandable && !isExpanded && rowIndex >= initialRowCount) {
          setIsExpanded(true);
        }

        // Scroll zur Zeile nach einem kurzen Delay (damit die Tabelle Zeit hat zu rendern)
        const timeoutId = setTimeout(() => {
          if (tableRef.current) {
            const rowElement = tableRef.current.querySelector(`[data-row-id="${selectedId}"]`);
            if (rowElement) {
              rowElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
          }
        }, 100);

        // Cleanup timeout
        return () => {
          clearTimeout(timeoutId);
        };
      }
    }
    return undefined;
  }, [selectedId, data, idKey, pageSize, expandable, isExpanded, initialRowCount, table]);

  // Loading State
  if (isLoading && data.length === 0) {
    return (
      <div data-testid="data-table-skeleton" className={cn('space-y-4', className)}>
        <TableSkeleton columns={columns} rows={10} showToolbar showPagination={!expandable} />
      </div>
    );
  }

  // Error State
  if (error) {
    const ErrorComponent = ErrorStateComponent ?? ErrorState;
    return (
      <div className={cn('space-y-4', className)}>
        <Card>
          <CardContent className="py-8">
            <ErrorComponent error={error} {...(onRetry ? { onRetry } : {})} />
          </CardContent>
        </Card>
      </div>
    );
  }

  // Empty State
  if (data.length === 0) {
    const EmptyComponent = EmptyStateComponent ?? EmptyState;
    return (
      <div className={cn('space-y-4', className)}>
        <Card>
          <CardContent className="py-12">
            <EmptyComponent />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* Toolbar */}
      <TableToolbar
        table={table}
        searchPlaceholder={searchPlaceholder}
        columnLabels={tableDefinition.labels}
        showColumnToggle={showColumnToggle}
        showColumnToggleText={showColumnToggleText}
        onAddClick={onAdd}
        addButtonText={addButtonText}
        addButtonTitle={addButtonTitle}
        globalFilter={globalFilter}
        onGlobalFilterChange={setGlobalFilter}
        searchableColumns={searchableColumns}
        disabledColumns={disabledColumns}
        tableDefinition={tableDefinition}
      />

      {/* Table */}
      <div
        ref={tableRef}
        className={cn(
          'overflow-auto rounded-md border',
          stickyHeader && 'relative',
          containerClassName
        )}
        style={maxHeight ? { maxHeight } : undefined}
      >
        <ShadCnTable>
          <ShadCnTableHeader className={stickyHeader ? 'bg-bw-gray-6 sticky top-0 z-10' : ''}>
            {table.getHeaderGroups().map(headerGroup => (
              <ShadCnTableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => {
                  const isActionColumn = header.column.id === 'actions';
                  return (
                    <ShadCnTableHead
                      key={header.id}
                      className={
                        (cn(isActionColumn && stickyActionColumn && 'sticky right-0 shadow-sm'),
                        'bg-bw-gray-6')
                      }
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </ShadCnTableHead>
                  );
                })}
              </ShadCnTableRow>
            ))}
          </ShadCnTableHeader>

          <ShadCnTableBody>
            {displayRows.length > 0 ? (
              displayRows.map(row => {
                const rowOriginal = row.original as TData & Record<string, unknown>;
                const rowId = String(rowOriginal[idKey] ?? '');
                const isSelected = selectedRowId === rowId || selectedId == rowOriginal[idKey];

                return (
                  <ShadCnTableRow
                    key={row.id}
                    data-row-id={rowId}
                    data-state={row.getIsSelected() && 'selected'}
                    onClick={() => onRowClick?.(row.original)}
                    className={cn(
                      onRowClick ? 'hover:bg-muted/50 cursor-pointer' : '',
                      isSelected && 'bg-muted/50'
                    )}
                  >
                    {row.getVisibleCells().map(cell => {
                      const isActionColumn = cell.column.id === 'actions';
                      return (
                        <ShadCnTableCell
                          key={cell.id}
                          className={cn(
                            isActionColumn &&
                              stickyActionColumn &&
                              'bg-background sticky right-0 shadow-sm'
                          )}
                        >
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </ShadCnTableCell>
                      );
                    })}
                  </ShadCnTableRow>
                );
              })
            ) : (
              <ShadCnTableRow>
                <ShadCnTableCell
                  colSpan={columns.length}
                  className="text-muted-foreground h-24 text-center"
                >
                  Keine Ergebnisse gefunden.
                </ShadCnTableCell>
              </ShadCnTableRow>
            )}
          </ShadCnTableBody>
        </ShadCnTable>
      </div>

      {/* Footer */}
      {(isExpanded || !expandable) && displayRows.length > 0 ? (
        <TablePagination table={table} />
      ) : null}

      {showExpandButton ? (
        <ExpandButton
          isExpanded={isExpanded}
          onToggle={() => {
            setIsExpanded(!isExpanded);
          }}
          collapsedCount={initialRowCount}
          totalCount={filteredRowsCount}
          customText={expandButtonText ?? {}}
        />
      ) : null}
    </div>
  );
};

/**
 * @module dataTable/hooks
 * @description Custom Hooks für DataTable Funktionalität
 */

import { useMemo, useEffect, useState } from 'react';

import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';

import { convertTableDefinition, getColumnVisibility } from './converter';

import type {
  DataTableController,
  DataTableProps,
  DataTableState,
  TableDataConstraint,
} from './types';

/**
 * useDataTable Hook
 */
export const useDataTable = <TData extends TableDataConstraint>(
  props: DataTableProps<TData>
): DataTableController<TData> => {
  const {
    tableDefinition,
    selectableColumns,
    data,
    isLoading = false,
    error = null,
    onEdit,
    onDelete,
    onAdd,
    onRetry,
    searchPlaceholder = 'Suche...',
    addButtonText,
    addButtonTitle,
    showColumnToggle = true,
    showColumnToggleText = false,
    expandable = false,
    initialRowCount = 5,
    expandButtonText,
    stickyHeader = false,
    stickyActionColumn = false,
    maxHeight,
    pageSize = 20,
    selectedId,
    idKey = 'id',
    containerClassName,
    disabledColumns,
  } = props;

  // State
  const [sorting, setSorting] = useState<DataTableState['sorting']>([]);
  const [columnFilters, setColumnFilters] = useState<DataTableState['columnFilters']>([]);
  const [globalFilter, setGlobalFilter] = useState<DataTableState['globalFilter']>('');
  const [isExpanded, setIsExpanded] = useState(!expandable);
  const [columnVisibility, setColumnVisibility] = useState(() =>
    getColumnVisibility(tableDefinition, effectiveSelectableColumns)
  );

  // Effective columns
  const effectiveSelectableColumns = useMemo(
    () => selectableColumns ?? tableDefinition.fields.map(field => field.id),
    [selectableColumns, tableDefinition.fields]
  );

  // Convert to TanStack columns
  const columns = useMemo(() => {
    const actions: { onEdit?: (row: TData) => void; onDelete?: (row: TData) => void } = {};
    if (onEdit) actions.onEdit = onEdit;
    if (onDelete) actions.onDelete = onDelete;
    return convertTableDefinition(tableDefinition, effectiveSelectableColumns, actions);
  }, [tableDefinition, effectiveSelectableColumns, onEdit, onDelete]);

  // Create table instance
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
      pagination: { pageSize },
    },
  });

  // Computed values
  const filteredRows = table.getFilteredRowModel().rows;
  const sortedRows = table.getSortedRowModel().rows;
  const paginatedRows = table.getPaginationRowModel().rows;
  const filteredRowsCount = filteredRows.length;

  const displayRows = useMemo(
    () => (expandable && !isExpanded ? sortedRows.slice(0, initialRowCount) : paginatedRows),
    [expandable, isExpanded, sortedRows, paginatedRows, initialRowCount]
  );

  const showExpandButton = expandable && filteredRowsCount > initialRowCount;
  const showPagination = !expandable || isExpanded;

  // Handle selected row scrolling
  useEffect(() => {
    if (selectedId && data.length > 0) {
      const rowIndex = data.findIndex(row => row[idKey] == selectedId);

      if (rowIndex !== -1) {
        const pageIndex = Math.floor(rowIndex / table.getState().pagination.pageSize);

        if (table.getState().pagination.pageIndex !== pageIndex) {
          table.setPageIndex(pageIndex);
        }

        if (expandable && !isExpanded && rowIndex >= initialRowCount) {
          setIsExpanded(true);
        }

        const timeoutId = setTimeout(() => {
          const rowElement = document.querySelector(`[data-row-id="${selectedId}"]`);
          rowElement?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);

        return () => {
          clearTimeout(timeoutId);
        };
      }
    }
    return undefined;
  }, [selectedId, data, idKey, expandable, isExpanded, initialRowCount, table]);

  // Build controller
  const state: DataTableState = {
    sorting,
    columnFilters,
    columnVisibility,
    globalFilter,
    isExpanded,
    selectedRows: {},
  };

  const controller: DataTableController<TData> = {
    // Table instance
    table,

    // State
    state,

    // Loading/Error/Empty states
    isLoading: isLoading && data.length === 0,
    isEmpty: !isLoading && !error && data.length === 0,
    error,

    // Computed values
    displayRows,
    showPagination,
    showExpandButton,

    // Props for sub-components
    toolbarProps: {
      table,
      globalFilter,
      onGlobalFilterChange: setGlobalFilter,
      searchPlaceholder,
      columnLabels: tableDefinition.labels,
      showColumnToggle,
      showColumnToggleText,
      onAddClick: onAdd,
      addButtonText,
      addButtonTitle,
      disabledColumns,
      tableDefinition,
    },

    paginationProps: {
      table,
    },

    expandProps: {
      isExpanded,
      onToggle: () => {
        setIsExpanded(!isExpanded);
      },
      collapsedCount: initialRowCount,
      totalCount: filteredRowsCount,
      customText: expandButtonText,
    },

    skeletonProps: {
      columns,
      rows: 10,
      showToolbar: true,
      showPagination: !expandable,
    },

    errorProps: {
      error: error ?? new Error('Unknown error'),
      onRetry,
    },

    emptyProps: {},

    tableProps: {
      className: containerClassName ?? '',
      style: maxHeight ? { maxHeight } : undefined,
    },

    coreTableProps: {
      table,
      stickyHeader,
      stickyActionColumn,
    },
  };

  return controller;
};

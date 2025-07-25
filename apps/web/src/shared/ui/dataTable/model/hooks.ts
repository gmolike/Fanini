/* eslint-disable complexity */
/**
 * @module dataTable/hooks
 * @description Custom Hooks für DataTable Funktionalität
 */

import { useCallback, useEffect, useMemo, useState } from 'react';

import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
} from '@tanstack/react-table';

import { debounce as debounceUtil } from '../lib/helpers';

import { convertTableDefinition, getColumnVisibility, getSearchableColumns } from './converter';

import type {
  DataTableController,
  DataTableProps,
  DataTableState,
  ServerSideParams,
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
    serverSide,
    onServerParamsChange,
    initialGlobalFilter,
    initialSorting,
  } = props;

  // State
  const [sorting, setSorting] = useState<DataTableState['sorting']>(initialSorting ?? []);
  const [columnFilters, setColumnFilters] = useState<DataTableState['columnFilters']>([]);
  const [globalFilter, setGlobalFilter] = useState<DataTableState['globalFilter']>(
    initialGlobalFilter ?? ''
  );
  const [isExpanded, setIsExpanded] = useState(!expandable);
  const [columnVisibility, setColumnVisibility] = useState(() =>
    getColumnVisibility(tableDefinition, effectiveSelectableColumns)
  );

  // State für Server-Parameter - initialisiere mit aktuellen Werten
  const [serverParams, setServerParams] = useState<ServerSideParams>({
    page: serverSide?.currentPage ?? 0,
    limit: serverSide?.pageSize ?? pageSize,
    search: initialGlobalFilter ?? '',
    sortBy: initialSorting?.[0]?.id,
    sortOrder: initialSorting?.[0]?.desc ? 'desc' : 'asc',
  });

  // Effective columns
  const effectiveSelectableColumns = useMemo(
    () => selectableColumns ?? tableDefinition.fields.map(field => field.id),
    [selectableColumns, tableDefinition.fields]
  );

  // Handle selected row scrolling

  // Sync server params when serverSide config changes (e.g., from URL)
  useEffect(() => {
    if (serverSide?.enabled) {
      setServerParams(prev => ({
        ...prev,
        page: serverSide.currentPage,
        limit: serverSide.pageSize,
      }));
    }
  }, [serverSide?.enabled, serverSide?.currentPage, serverSide?.pageSize]);

  // Debounced search handler für Server-Mode
  const debouncedServerSearch = useMemo(
    () =>
      debounceUtil((...args: unknown[]) => {
        const search = args[0] as string;
        const newParams: ServerSideParams = {
          ...serverParams,
          search,
          page: 0, // Reset auf erste Seite bei neuer Suche
        };
        setServerParams(newParams);
        onServerParamsChange?.(newParams);
      }, serverSide?.debounceMs ?? 300),
    [serverParams, onServerParamsChange, serverSide?.debounceMs]
  );

  // Handle global filter change
  const handleGlobalFilterChange = useCallback(
    (value: string) => {
      setGlobalFilter(value);

      if (serverSide?.enabled) {
        debouncedServerSearch(value);
      }
    },
    [serverSide?.enabled, debouncedServerSearch]
  );

  // Handle sorting change
  const handleSortingChange = useCallback(
    (updater: SortingState | ((old: SortingState) => SortingState)) => {
      const newSorting = typeof updater === 'function' ? updater(sorting) : updater;
      setSorting(newSorting);

      if (serverSide?.enabled && onServerParamsChange) {
        const sortConfig = newSorting[0];
        const newParams: ServerSideParams = {
          ...serverParams,
          sortBy: sortConfig?.id,
          sortOrder: sortConfig?.desc ? 'desc' : 'asc',
          page: 0, // Reset auf erste Seite bei neuer Sortierung
        };
        setServerParams(newParams);
        onServerParamsChange(newParams);
      }
    },
    [serverSide?.enabled, sorting, serverParams, onServerParamsChange]
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
      ...(serverSide?.enabled
        ? {
            pagination: {
              pageIndex: serverSide.currentPage,
              pageSize: serverSide.pageSize,
            },
          }
        : {}),
    },
    // Server-Mode Konfiguration
    manualPagination: serverSide?.enabled,
    manualSorting: serverSide?.enabled,
    manualFiltering: serverSide?.enabled,
    pageCount: serverSide?.enabled
      ? Math.ceil(serverSide.totalCount / serverSide.pageSize)
      : undefined,

    // Event Handler
    onSortingChange: handleSortingChange,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: updater => {
      if (serverSide?.enabled && onServerParamsChange) {
        const newPaginationState =
          typeof updater === 'function' ? updater(table.getState().pagination) : updater;

        const newParams: ServerSideParams = {
          ...serverParams,
          page: newPaginationState.pageIndex,
          limit: newPaginationState.pageSize,
        };
        setServerParams(newParams);
        onServerParamsChange(newParams);
      }
    },

    // Row Model Functions
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: serverSide?.enabled ? undefined : getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: serverSide?.enabled ? undefined : getSortedRowModel(),

    initialState: {
      pagination: {
        pageSize: serverSide?.pageSize ?? pageSize,
      },
    },
  });

  const filteredRows = serverSide?.enabled
    ? table.getCoreRowModel().rows // Verwende getCoreRowModel für konsistente Row-Typen
    : table.getFilteredRowModel().rows;

  const sortedRows = serverSide?.enabled
    ? table.getCoreRowModel().rows // Auch hier getCoreRowModel verwenden
    : table.getSortedRowModel().rows;

  const paginatedRows = table.getPaginationRowModel().rows;

  const filteredRowsCount = serverSide?.enabled ? serverSide.totalCount : filteredRows.length;

  const displayRows = useMemo(
    () => (expandable && !isExpanded ? sortedRows.slice(0, initialRowCount) : paginatedRows),
    [expandable, isExpanded, sortedRows, paginatedRows, initialRowCount]
  );

  const showExpandButton = expandable && filteredRowsCount > initialRowCount;
  const showPagination = !expandable || isExpanded;

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
  const controller: DataTableController<TData> = {
    // Table instance
    table,

    // State
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      globalFilter,
      isExpanded,
      selectedRows: {},
    },

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
      onGlobalFilterChange: handleGlobalFilterChange,
      searchPlaceholder,
      columnLabels: tableDefinition.labels,
      showColumnToggle,
      showColumnToggleText,
      onAddClick: onAdd,
      addButtonText,
      addButtonTitle,
      disabledColumns,
      searchableColumns: getSearchableColumns(tableDefinition),
      tableDefinition,
      serverSide,
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

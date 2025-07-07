/**
 * @module dataTable/converter
 * @description Konvertierung zwischen TableDefinition und TanStack Table Columns
 */

import { Actions } from '../ui/cells/Actions';
import { Text } from '../ui/cells/Text';
import { Sortable } from '../ui/headers';

import type { CellProps, ExtractedKey, FieldDefinition, TableDefinition } from './types';
import type {
  AccessorColumnDef,
  CellContext,
  ColumnDef,
  DisplayColumnDef,
  HeaderContext,
  VisibilityState,
} from '@tanstack/react-table';

/**
 * Konvertiert eine TableDefinition zu TanStack Table Columns
 */
export const convertTableDefinition = <TData extends Record<string, unknown>>(
  definition: TableDefinition<TData>,
  selectableColumns?: (ExtractedKey<TData> | 'actions')[],
  callbacks?: {
    onEdit?: (row: TData) => void;
    onDelete?: (row: TData) => void;
  }
): ColumnDef<TData>[] => {
  const fieldsToShow = selectableColumns
    ? definition.fields.filter(field => selectableColumns.includes(field.id))
    : definition.fields;

  return fieldsToShow.map(field =>
    convertFieldToColumn(field, definition.labels[field.id] || field.id, callbacks)
  );
};

/**
 * Konvertiert ein einzelnes Field zu einer Column Definition
 */
const convertFieldToColumn = <TData extends Record<string, unknown>>(
  field: FieldDefinition<TData, ExtractedKey<TData> | 'actions'>,
  label: string,
  callbacks?: {
    onEdit?: (row: TData) => void;
    onDelete?: (row: TData) => void;
  }
): ColumnDef<TData> => {
  const baseColumn = {
    id: field.id,
    enableSorting: field.sortable !== false,
    enableGlobalFilter: field.searchable !== false,
    enableColumnFilter: field.filterable ?? false,
    header: createHeader<TData>(label, field.sortable),
    size: typeof field.width === 'number' ? field.width : undefined,
  };

  // Actions Column (keine Daten, nur Buttons)
  if (field.id === 'actions') {
    const displayColumn: DisplayColumnDef<TData> = {
      ...baseColumn,
      cell: ({ row }: CellContext<TData, unknown>) => (
        <Actions
          row={row.original}
          {...(callbacks?.onEdit ? { onEdit: callbacks.onEdit } : {})}
          {...(callbacks?.onDelete ? { onDelete: callbacks.onDelete } : {})}
        />
      ),
    };
    return displayColumn;
  }

  // Data Column
  const accessorColumn: AccessorColumnDef<TData> = {
    ...baseColumn,
    ...(typeof field.accessor === 'function'
      ? { accessorFn: field.accessor }
      : {
          accessorKey:
            typeof field.accessor === 'string' ? field.accessor : (field.id as keyof TData),
        }),
    cell: createCell(field),
  };

  return accessorColumn;
};

/**
 * Erstellt die Header-Komponente für eine Column
 */
const createHeader = <TData extends Record<string, unknown>>(label: string, sortable?: boolean) => {
  if (sortable !== false) {
    return (props: HeaderContext<TData, unknown>) => (
      <Sortable label={label} column={props.column} />
    );
  }
  return () => <span className="text-xs font-medium tracking-wider uppercase">{label}</span>;
};

/**
 * Erstellt die Cell-Komponente basierend auf der Field Definition
 */
const createCell = <TData extends Record<string, unknown>>(
  field: FieldDefinition<TData, ExtractedKey<TData> | 'actions'>
) => {
  return ({ getValue, row }: CellContext<TData, unknown>) => {
    const value = getValue();
    const cellProps: CellProps<TData> = { value, row: row.original };

    // Default Text Cell
    if (field.cell === undefined) {
      return <Text {...cellProps} />;
    }

    // Custom Component Cell
    if (typeof field.cell !== 'string') {
      const CellComponent = field.cell;
      return <CellComponent {...cellProps} />;
    }

    // Fallback
    return <Text {...cellProps} />;
  };
};

/**
 * Extrahiert die initiale Column Visibility aus der Definition
 */
export const getColumnVisibility = <TData extends Record<string, unknown>>(
  definition: TableDefinition<TData>,
  selectableColumns?: (ExtractedKey<TData> | 'actions')[]
): VisibilityState => {
  const visibility: VisibilityState = {};

  definition.fields.forEach(field => {
    visibility[field.id] = selectableColumns
      ? selectableColumns.includes(field.id)
      : field.defaultVisible !== false;
  });

  return visibility;
};

/**
 * Extrahiert alle durchsuchbaren Spalten aus der Definition
 */
export const getSearchableColumns = <TData extends Record<string, unknown>>(
  definition: TableDefinition<TData>
): string[] => definition.fields.filter(field => field.searchable === true).map(field => field.id);

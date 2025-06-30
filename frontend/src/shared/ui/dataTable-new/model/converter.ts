/**
 * @module dataTable/converter
 * @description Konvertierung zwischen TableDefinition und TanStack Table Columns
 */

import type {
  AccessorColumnDef,
  CellContext,
  ColumnDef,
  DisplayColumnDef,
  HeaderContext,
  VisibilityState
} from '@tanstack/react-table';

import { Actions } from '../ui/cells';
import { Text } from '../ui/cells';
import { Sortable } from '../ui/headers';

import type {
  ExtractedKey,
  FieldDefinition,
  TableDefinition,
  CellProps
} from './types';

/**
 * Konvertiert eine TableDefinition zu TanStack Table Columns
 *
 * @description Transformiert die abstrakte TableDefinition in konkrete Column Definitions
 * die von TanStack Table verstanden werden. Behandelt spezielle Fälle wie Actions-Spalten
 * und Custom Cell Components.
 *
 * @template TData - Datentyp der Tabellenzeilen
 * @param definition - Die Table Definition
 * @param selectableColumns - Array der anzuzeigenden Spalten IDs
 * @param callbacks - Callbacks für Edit/Delete Actions
 * @returns Array von TanStack Column Definitions
 */
export const convertTableDefinition = <TData>(
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
const convertFieldToColumn = <TData>(
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
          onEdit={callbacks?.onEdit}
          onDelete={callbacks?.onDelete}
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
      : { accessorKey: field.accessor || (field.id as keyof TData) }
    ),
    cell: createCell(field),
  };

  return accessorColumn;
};

/**
 * Erstellt die Header-Komponente für eine Column
 */
const createHeader = <TData>(label: string, sortable?: boolean) => {
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
const createCell = <TData>(
  field: FieldDefinition<TData, ExtractedKey<TData> | 'actions'>
) => {
  return ({ getValue, row }: CellContext<TData, unknown>) => {
    const value = getValue();
    const cellProps: CellProps<TData> = { value, row: row.original };

    // Default Text Cell
    if (!field.cell || field.cell === 'default') {
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
 *
 * @description Erstellt ein Visibility-Objekt für TanStack Table basierend auf
 * der TableDefinition und den ausgewählten Spalten.
 *
 * @template TData - Datentyp der Tabellenzeilen
 * @param definition - Die Table Definition
 * @param selectableColumns - Array der anzuzeigenden Spalten IDs
 * @returns Visibility State Object
 */
export const getColumnVisibility = <TData>(
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
 *
 * @description Findet alle Felder die als searchable markiert sind und
 * gibt deren IDs als Array zurück.
 *
 * @template TData - Datentyp der Tabellenzeilen
 * @param definition - Die Table Definition
 * @returns Array von Spalten-IDs die durchsuchbar sind
 */
export const getSearchableColumns = <TData>(
  definition: TableDefinition<TData>
): string[] => definition.fields
  .filter(field => field.searchable === true)
  .map(field => field.id);

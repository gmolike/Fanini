/**
 * @module dataTable/types
 * @description Zentrale Type-Definitionen für die DataTable Komponente
 */

import type {
  ColumnDef,
  ColumnFiltersState,
  Row,
  SortingState,
  Table as TanstackTable,
  VisibilityState,
} from '@tanstack/react-table';

/**
 * Props für die Haupt-DataTable Komponente
 * @template TData - Datentyp der Tabellenzeilen
 * @template TTableDef - Typ der TableDefinition
 */
export const createTableDefinition = <TData extends Record<string, unknown>>(
  definition: TableDefinition<TData>
): TableDefinition<TData> => definition;

// ========================================
// COMPONENT PROPS
// ========================================
/**
 * Props für Cell Components
 * @template TData - Datentyp der Tabellenzeile
 */
export const TABLE_PRESETS = {
  simple: {
    showColumnToggle: false,
    pageSize: 10,
  },
  advanced: {
    showColumnToggle: true,
    pageSize: 20,
  },
  dashboard: {
    expandable: true,
    initialRowCount: 3,
    showColumnToggle: false,
    pageSize: 10,
  },
  compact: {
    showColumnToggle: false,
    pageSize: 5,
    maxHeight: '400px',
  },
} as const;

// ========================================
// PRESETS
// ========================================
/**
 * Vordefinierte Table-Konfigurationen
 */
export type CellProps<TData> = {
  /** Zellenwert */
  value: unknown;
  /** Vollständige Zeilen-Daten */
  row: TData;
};

// ========================================
// HOOK TYPES
// ========================================
/**
 * State für den useDataTable Hook
 */
export type DataTableController<TData> = {
  // Table Instance
  table: TanstackTable<TData>;

  // State
  state: DataTableState;

  // Computed Values
  displayRows: Row<TData>[];
  isLoading: boolean;
  isEmpty: boolean;
  error: Error | null;
  showPagination: boolean;
  showExpandButton: boolean;

  // Props für Sub-Components
  toolbarProps: ToolbarProps<TData>;
  paginationProps: PaginationProps<TData>;
  expandProps: ExpandButtonProps;
  skeletonProps: SkeletonProps<TData>;
  errorProps: ErrorStateProps;
  emptyProps: Record<string, never>;
  tableProps: {
    className: string;
    style?: React.CSSProperties | undefined;
  };
  coreTableProps: {
    table: TanstackTable<TData>;
    stickyHeader?: boolean;
    stickyActionColumn?: boolean;
  };
};

// ========================================
// SUB-COMPONENT PROPS
// ========================================
/**
 * Props für Error State Component
 */
export type DataTableProps<
  TData extends TableDataConstraint = TableDataConstraint,
  TTableDef extends TableDefinition<TData> = TableDefinition<TData>,
> = {
  // Core Props
  tableDefinition: TTableDef;
  selectableColumns?: ExtractFieldId<TTableDef>[];
  disabledColumns?: ExtractFieldId<TTableDef>[];
  data: TData[];

  // State Props
  isLoading?: boolean;
  error?: Error | null;

  // Callbacks
  onRowClick?: (row: TData) => void;
  onEdit?: (row: TData) => void;
  onDelete?: (row: TData) => void;
  onAdd?: () => void;
  onRetry?: () => void;

  // UI Options
  searchPlaceholder?: string;
  addButtonText?: string;
  addButtonTitle?: string;
  showColumnToggle?: boolean;
  showColumnToggleText?: boolean;

  // Features
  expandable?: boolean;
  initialRowCount?: number;
  expandButtonText?: {
    expand?: string;
    collapse?: string;
  };
  stickyHeader?: boolean;
  stickyActionColumn?: boolean;
  maxHeight?: string;
  pageSize?: number;
  selectedRowId?: string | null;
  selectedId?: string;
  idKey?: keyof TData;

  // Styling
  className?: string;
  containerClassName?: string;

  // Custom Components
  emptyStateComponent?: React.ComponentType;
  errorStateComponent?: React.ComponentType<ErrorStateProps>;
};

/**
 * Props für Expand Button Component
 */
export type DataTableState = {
  sorting: SortingState;
  columnFilters: ColumnFiltersState;
  columnVisibility: VisibilityState;
  globalFilter: string;
  isExpanded: boolean;
  selectedRows: Record<string, boolean>;
};

/**
 * Extrahiert alle Keys aus einem Type als String Union
 */
export type ErrorStateProps = {
  error: Error;
  onRetry?: (() => void) | undefined;
};

/**
 * Extrahiert Field IDs aus einer TableDefinition
 */
export type ExpandButtonProps = {
  isExpanded: boolean;
  onToggle: () => void;
  collapsedCount: number;
  totalCount: number;
  customText?:
    | {
        expand?: string;
        collapse?: string;
      }
    | undefined;
};

// ========================================
// TABLE DEFINITION
// ========================================
/**
 * Definition eines einzelnen Tabellen-Feldes
 * @template TData - Datentyp der Tabellenzeilen
 * @template TFieldId - Union Type der erlaubten Field IDs
 */
/**
 * Extrahiert alle Keys aus einem Type als String Union
 */
export type ExtractedKey<T> = T extends Record<string, unknown> ? keyof T & string : never;

// ========================================
// BASE TYPES
// ========================================
/**
 * Basis-Constraint für Tabellendaten
 * @description Minimal erforderliche Struktur für DataTable Rows
 */
export type ExtractFieldId<TTableDef> = TTableDef extends {
  fields: readonly { id: infer TId }[];
}
  ? TId
  : never;

/**
 * Komplette Tabellen-Definition
 * @template TData - Datentyp der Tabellenzeilen
 */
export type FieldDefinition<TData = unknown, TFieldId extends string = string> = {
  /** Eindeutige ID der Spalte */
  id: TFieldId;

  /** Accessor für den Wert */
  accessor?: TFieldId extends 'actions' ? never : TFieldId | ((row: TData) => unknown);

  /** Sortierbarkeit der Spalte */
  sortable?: boolean;

  /** Durchsuchbarkeit der Spalte */
  searchable?: boolean;

  /** Ausblendbarkeit der Spalte */
  toggleable?: boolean;

  /** Filterbarkeit der Spalte */
  filterable?: boolean;

  /** Standard-Sichtbarkeit */
  defaultVisible?: boolean;

  /** Cell Component oder Template */
  cell?: React.ComponentType<CellProps<TData>> | 'default' | 'actions';

  /** Breite der Spalte */
  width?: number | string;
};

/**
 * Props für Toolbar Component
 */
export type FieldId<TData> = ExtractedKey<TData> | 'actions';

/**
 * Controller Return Type des useDataTable Hooks
 */
export type PaginationProps<TData> = {
  table: TanstackTable<TData>;
};

/**
 * Field ID Type für TableDefinition
 */
export type SkeletonProps<TData = unknown, TValue = unknown> = {
  columns: ColumnDef<TData, TValue>[];
  rows?: number;
  showToolbar?: boolean;
  showPagination?: boolean;
};

/**
 * Props für Pagination Component
 */
export type TableDataConstraint = {
  id?: string;
  [key: string]: unknown;
};

/**
 * Type für Table Preset Namen
 */
export type TableDefinition<TData = unknown> = {
  /** Labels für alle Spalten */
  labels: Record<FieldId<TData>, string>;

  /** Feld-Definitionen */
  fields: FieldDefinition<TData, FieldId<TData>>[];
};

/**
 * Props für Skeleton Component
 */
export type TablePreset = keyof typeof TABLE_PRESETS;

/**
 * Erstellt eine typsichere TableDefinition
 *
 * @description Factory Function die TypeScript bei der korrekten Type-Inference unterstützt
 *
 * @template TData - Der Datentyp der Tabellenzeilen
 * @param definition - Die Table Definition
 * @returns Die unveränderte Definition mit korrekter Typisierung
 */
export type ToolbarProps<TData> = {
  table: TanstackTable<TData>;
  globalFilter?: string | undefined;
  onGlobalFilterChange?: ((value: string) => void) | undefined;
  searchPlaceholder?: string | undefined;
  columnLabels?: Record<string, string> | undefined;
  showColumnToggle?: boolean | undefined;
  showColumnToggleText?: boolean | undefined;
  onAddClick?: (() => void) | undefined;
  addButtonText?: string | undefined;
  addButtonTitle?: string | undefined;
  searchableColumns?: string[] | undefined;
  disabledColumns?: string[] | undefined;
  tableDefinition?: TableDefinition<TData> | undefined;
};

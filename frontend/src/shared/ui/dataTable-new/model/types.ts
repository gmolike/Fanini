/**
 * @module dataTable/types
 * @description Zentrale Type-Definitionen für die DataTable Komponente
 */

import type {
  ColumnDef,
  SortingState,
  VisibilityState,
  ColumnFiltersState,
  Table as TanstackTable,
  Row,
} from '@tanstack/react-table';

// ========================================
// BASE TYPES
// ========================================

/**
 * Basis-Constraint für Tabellendaten
 * @description Minimal erforderliche Struktur für DataTable Rows
 */
export type TableDataConstraint = {
  id?: string;
  [key: string]: unknown;
};

/**
 * Extrahiert alle Keys aus einem Type als String Union
 */
export type ExtractedKey<T> = T extends Record<string, any> ? keyof T & string : never;

/**
 * Field ID Type für TableDefinition
 */
export type FieldId<TData> = ExtractedKey<TData> | 'actions';

// ========================================
// TABLE DEFINITION
// ========================================

/**
 * Definition eines einzelnen Tabellen-Feldes
 * @template TData - Datentyp der Tabellenzeilen
 * @template TFieldId - Union Type der erlaubten Field IDs
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
 * Komplette Tabellen-Definition
 * @template TData - Datentyp der Tabellenzeilen
 */
export type TableDefinition<TData = unknown> = {
  /** Labels für alle Spalten */
  labels: Record<FieldId<TData>, string>;

  /** Feld-Definitionen */
  fields: FieldDefinition<TData, FieldId<TData>>[];
};

// ========================================
// COMPONENT PROPS
// ========================================

/**
 * Props für Cell Components
 * @template TData - Datentyp der Tabellenzeile
 */
export type CellProps<TData> = {
  /** Zellenwert */
  value: unknown;
  /** Vollständige Zeilen-Daten */
  row: TData;
};

/**
 * Props für die Haupt-DataTable Komponente
 * @template TData - Datentyp der Tabellenzeilen
 * @template TTableDef - Typ der TableDefinition
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
 * Extrahiert Field IDs aus einer TableDefinition
 */
export type ExtractFieldId<TTableDef> = TTableDef extends {
  fields: readonly { id: infer TId }[];
}
  ? TId
  : never;

// ========================================
// SUB-COMPONENT PROPS
// ========================================

/**
 * Props für Error State Component
 */
export type ErrorStateProps = {
  error: Error;
  onRetry?: (() => void) | undefined;
};

/**
 * Props für Toolbar Component
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

/**
 * Props für Pagination Component
 */
export type PaginationProps<TData> = {
  table: TanstackTable<TData>;
};

/**
 * Props für Expand Button Component
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

/**
 * Props für Skeleton Component
 */
export type SkeletonProps<TData = unknown, TValue = unknown> = {
  columns: ColumnDef<TData, TValue>[];
  rows?: number;
  showToolbar?: boolean;
  showPagination?: boolean;
};

// ========================================
// HOOK TYPES
// ========================================

/**
 * State für den useDataTable Hook
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
 * Controller Return Type des useDataTable Hooks
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
// PRESETS
// ========================================

/**
 * Vordefinierte Table-Konfigurationen
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

/**
 * Type für Table Preset Namen
 */
export type TablePreset = keyof typeof TABLE_PRESETS;

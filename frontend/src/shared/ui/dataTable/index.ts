export {
  type CellProps,
  createTableDefinition,
  type DataTableProps,
  type ExtractedKey,
  type FieldDefinition,
  type FieldId,
  TABLE_PRESETS,
  type TableDataConstraint,
  type TableDefinition,
  type TablePreset,
} from './model/types';
export { ActionsCell, BooleanCell, DateCell, EmailCell, PhoneCell, TextCell } from './ui/cells';

// ========================================
// BUTTON COMPONENTS
// ========================================
export {
  CompactDelete as CompactDeleteButton,
  Delete as TableDeleteButton,
  Edit as TableEditButton,
} from './ui/buttons';

// ========================================
// MODEL EXPORTS
// ========================================
export {
  convertTableDefinition,
  getColumnVisibility,
  getSearchableColumns,
} from './model/converter';

// ========================================
// HELPER FUNCTIONS
// ========================================
export { createSkeletonData, debounce, formatColumnLabels } from './lib/helpers';
export { createTableConfig } from './lib/presets';

/**
 * @module dataTable
 * @description Public API für die DataTable Komponente
 */
// ========================================
// HAUPTKOMPONENTE
// ========================================
export { DataTable } from './ui/DataTable';

// ========================================
// HEADER COMPONENTS
// ========================================
export {
  Filterable as FilterableHeader,
  Simple as SimpleHeader,
  Sortable as SortableHeader,
} from './ui/headers';

// ========================================
// CELL COMPONENTS
// ========================================
export { useDataTable } from './model/hooks';

// ========================================
// RE-EXPORT TYPES für Erweiterungen
// ========================================
export type {
  ErrorStateProps,
  ExpandButtonProps,
  PaginationProps,
  SkeletonProps,
  ToolbarProps,
} from './model/types';

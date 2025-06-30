












export {
  ActionsCell,
  BooleanCell,
  DateCell,
  EmailCell,
  PhoneCell,
  TextCell,
} from './components/CellTemplates';
// ========================================
// 3. WIEDERVERWENDBARE KOMPONENTEN
// ========================================
// Components die oft extern verwendet werden
export {
  CompactDeleteButton,
  TableDeleteButton,
  type TableDeleteButtonProps,
  TableEditButton,
} from './components/CellButtons';
// ========================================
// 4. CELL COMPONENTS & TEMPLATES
// ========================================
// Cell Templates
export {
  convertTableDefinition,
  getColumnVisibility,
  getSearchableColumns,
} from './model/TableConverter';
export { createSkeletonData, createTableConfig, formatColumnLabels } from './utils/tableHelpers';
// Cell Buttons
export { createTableDefinition } from './model/tableDefinition';










// ========================================
// 2. TYPES (als type exports)
// ========================================
// Core Types aus table-definition
export { DataTable } from './DataTable';






/**
 * DataTable Public API - Optimiert für FSD ohne zirkuläre Abhängigkeiten
 *
 * Export-Regeln:
 * 1. Hauptkomponente direkt exportieren
 * 2. Types als Type-Exports für Tree-Shaking
 * 3. Wiederverwendbare Components
 * 4. Utils nur wenn extern benötigt
 */
// ========================================
// 1. HAUPT-KOMPONENTE
// ========================================
export { EmptyState } from './components/EmptyState';

// Erweiterte Types aus types.ts (falls vorhanden)
export { ErrorState } from './components/ErrorState';


// ========================================
// 7. UTILS & HELPERS
// ========================================
// Table Converter
export { ExpandButton } from './components/ExpandButton';








// Helper Functions (falls vorhanden)
export {
  FilterableHeader,
  headerTemplates,
  type HeaderType,
  SimpleHeader,
  SortableHeader,
} from './components/CellHeaders';
export { tablePresets } from './types';





// ========================================
// 8. PRESETS (falls vorhanden)
// ========================================
export type {
  BaseDataTableProps,
  DataTableFeatures,
  ExpandButtonProps,
  PaginationProps,
  RowSelectionState,
  TableDataConstraint,
  TableSkeletonProps,
  ToolbarProps,
} from './types';




// ========================================
// 5. HEADER COMPONENTS
// ========================================
export type { DataTableProps, FieldDefinition, TableDefinition } from './model/tableDefinition';

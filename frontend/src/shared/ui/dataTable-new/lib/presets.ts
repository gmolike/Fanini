/**
 * @module dataTable/presets
 * @description Vordefinierte Konfigurationen für häufige Use-Cases
 */

import {
  TABLE_PRESETS,
  type DataTableProps,
  type TableDataConstraint,
  type TablePreset,
} from '../model/types';

/**
 * Erstellt eine Table-Konfiguration basierend auf einem Preset
 *
 * @description Kombiniert ein vordefiniertes Preset mit optionalen Überschreibungen
 *
 * @template TData - Datentyp der Tabellenzeilen
 * @param preset - Name des Presets
 * @param overrides - Optionale Überschreibungen
 * @returns Kombinierte Konfiguration
 *
 * @example
 * ```tsx
 * const config = createTableConfig('dashboard', {
 *   pageSize: 10,
 *   onAddClick: () => navigate('/new')
 * });
 *
 * <DataTable {...config} tableDefinition={def} data={data} />
 * ```
 */
export const createTableConfig = <TData extends TableDataConstraint>(
  preset: TablePreset,
  overrides?: Partial<DataTableProps<TData>>
): Partial<DataTableProps<TData>> => {
  const presetConfig = TABLE_PRESETS[preset];
  return {
    ...presetConfig,
    ...overrides,
  };
};

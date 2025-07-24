// apps/web/src/demo/shared/lib/converters/filterConverter.ts
// Final location: apps/web/src/shared/lib/converters/filterConverter.ts

import type { DataTableFilterState, GlobalFilterRequest } from '../../api/types/filter';

/**
 * Konvertiert DataTable State zu Backend Request
 * @description Transformiert den internen DataTable State in das Backend-Format
 * @param state - DataTable Filter State
 * @returns GlobalFilterRequest für das Backend
 */
export const toGlobalFilterRequest = (state: DataTableFilterState): GlobalFilterRequest => ({
  page: state.page,
  pageSize: state.pageSize,
  searchTerm: state.searchTerm,
  sort: state.sortBy && state.sortOrder ? [`${state.sortBy}+${state.sortOrder}`] : [],
});

/**
 * Extrahiert Sortierung aus Backend Format
 * @description Konvertiert Backend sort Array zu DataTable Format
 * @param sort - Sort Array vom Backend
 * @returns Sortierungs-Objekt für DataTable
 */
export const fromBackendSort = (
  sort: string[]
): Pick<DataTableFilterState, 'sortBy' | 'sortOrder'> => {
  if (!sort.length) return {};

  const [field, order] = sort[0]?.split('+') ?? ['', ''];
  return {
    sortBy: field,
    sortOrder: order as 'asc' | 'desc',
  };
};

// src/shared/api/utils/sortUtils.ts

/**
 * Convert DataTable sort to Backend format
 * @description Konvertiert sortBy/sortOrder zu Backend sort Array
 */
export const toBackendSort = (sortBy?: string, sortOrder?: 'asc' | 'desc'): string[] => {
  if (!sortBy) return [];
  return [`${sortBy}+${sortOrder || 'asc'}`];
};

/**
 * Parse Backend sort to DataTable format
 * @description Konvertiert Backend sort Array zu sortBy/sortOrder
 */
export const fromBackendSort = (
  sort: string[]
): { sortBy?: string; sortOrder?: 'asc' | 'desc' } => {
  if (!sort || sort.length === 0) return {};

  const [field, order] = sort[0].split('+');
  return {
    sortBy: field,
    sortOrder: (order as 'asc' | 'desc') || 'asc',
  };
};

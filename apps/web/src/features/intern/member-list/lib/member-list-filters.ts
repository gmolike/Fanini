import { ROLE_CONFIG } from '@/entities/intern/member';

import type { MemberListFilters } from '../model/types';

/**
 * Erstellt die Default-Filter für die Member Liste
 */
export const createDefaultFilters = (): MemberListFilters => ({
  active: true,
  search: '',
  roleId: undefined,
  page: 1,
  limit: 20,
  sortBy: 'name',
  sortOrder: 'asc',
});

/**
 * Formatiert die Filter für die API
 */
export const formatFiltersForApi = (filters: MemberListFilters) => {
  const params = new URLSearchParams();

  if (filters.active !== undefined) {
    params.append('active', filters.active.toString());
  }
  if (filters.search) {
    params.append('search', filters.search);
  }
  if (filters.roleId) {
    params.append('roleId', filters.roleId);
  }
  if (filters.page) {
    params.append('page', filters.page.toString());
  }
  if (filters.limit) {
    params.append('limit', filters.limit.toString());
  }
  if (filters.sortBy) {
    params.append('sortBy', filters.sortBy);
  }
  if (filters.sortOrder) {
    params.append('sortOrder', filters.sortOrder);
  }

  return params.toString();
};

/**
 * Verfügbare Rollen-Filter Optionen
 */
export const getRoleFilterOptions = () =>
  Object.entries(ROLE_CONFIG).map(([value, config]) => ({
    value,
    label: config.label,
  }));

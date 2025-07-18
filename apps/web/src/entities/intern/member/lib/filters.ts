import { ROLE_CONFIG } from '../model/constants';

import type { MemberListFilters, MemberRole } from '../model/types';

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
export const getRoleFilterOptions = () => {
  // ROLE_CONFIG ist eine EnumVariantConfig, wir müssen anders darauf zugreifen
  const roles: MemberRole[] = [
    'ADMIN',
    'VORSTAND',
    'BEIRAT',
    'KASSENPRUFER',
    'TEAM_EVENT',
    'TEAM_TECHNIK',
    'TEAM_MEDIEN',
    'TEAM_VEREIN',
    'MITGLIED',
  ];

  return roles.map(role => {
    const config = ROLE_CONFIG[role as keyof typeof ROLE_CONFIG];
    const label =
      typeof config === 'object' && 'label' in config ? (config as { label: string }).label : role;
    return {
      value: role,
      label,
    };
  });
};

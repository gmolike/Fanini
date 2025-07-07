// frontend/src/entities/public/organization-structure/api/queries.ts
import { useQuery, type UseQueryResult } from '@tanstack/react-query';

import { apiClient } from '@/shared/api';

import { organizationStructureSchema } from '../model/schemas';

import type { OrganizationNode } from '../model/types';

export const useOrganizationStructure = (): UseQueryResult<OrganizationNode> => {
  return useQuery({
    queryKey: ['organization', 'structure'],
    queryFn: async () => {
      const response = await apiClient.get('/api/public/organization/structure');
      return organizationStructureSchema.parse(response);
    },
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
  });
};

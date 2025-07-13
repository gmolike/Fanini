// frontend/src/entities/public/faq/api/queries.ts
import { useQuery, type UseQueryResult } from '@tanstack/react-query';

import { apiClient } from '@/shared/api';

import { faqListResponseSchema } from '../model/schemas';

import type { FaqItem } from '../model/types';

export const useFaqList = (): UseQueryResult<{
  data: FaqItem[];
  meta: { total: number; categories: string[] };
}> => {
  return useQuery({
    queryKey: ['faq', 'list'],
    queryFn: async () => {
      const response = await apiClient.get('/api/public/faq');
      return faqListResponseSchema.parse(response);
    },
    staleTime: 1000 * 60 * 60, // 1 hour
  });
};

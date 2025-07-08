// frontend/src/entities/public/newsletter/api/queries.ts
import { useQuery, type UseQueryResult } from '@tanstack/react-query';

import { apiClient } from '@/shared/api';

import { newsletterDetailResponseSchema, newsletterListResponseSchema } from '../model/schemas';

import type { NewsletterDetailResponse, NewsletterListResponse } from '../model/types';

export const useNewsletterList = (): UseQueryResult<NewsletterListResponse> => {
  return useQuery({
    queryKey: ['newsletter', 'list'],
    queryFn: async () => {
      const response = await apiClient.get<NewsletterListResponse>('/api/public/newsletter/list');
      return newsletterListResponseSchema.parse(response);
    },
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};

export const useNewsletterDetail = (
  newsletterId: string | undefined,
  options?: { enabled?: boolean }
): UseQueryResult<NewsletterDetailResponse> => {
  return useQuery({
    queryKey: ['newsletter', 'detail', newsletterId ?? ''],
    queryFn: async () => {
      if (!newsletterId) throw new Error('Newsletter ID is required');
      const response = await apiClient.get<NewsletterDetailResponse>(
        `/api/public/newsletter/${newsletterId}`
      );
      return newsletterDetailResponseSchema.parse(response);
    },
    enabled: !!newsletterId && options?.enabled !== false,
    staleTime: 1000 * 60 * 30, // 30 minutes
  });
};

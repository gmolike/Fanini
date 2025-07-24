// entities/public/newsletter/api/queryOptions.ts
import { queryOptions } from '@tanstack/react-query';

import { apiClient } from '@/shared/api';
import { API_ROUTES } from '@/shared/api/constants';

import { newsletterDetailResponseSchema } from '../model/schemas';

import type { NewsletterDetailResponse } from '../model/types';

export const newsletterDetailQueryOptions = (newsletterId: string) =>
  queryOptions({
    queryKey: ['newsletter', 'detail', newsletterId],
    queryFn: async () => {
      const response = await apiClient.get<NewsletterDetailResponse>(
        API_ROUTES.PUBLIC.NEWSLETTER.DETAIL(newsletterId)
      );
      return newsletterDetailResponseSchema.parse(response);
    },
    staleTime: 1000 * 60 * 30, // 30 minutes
  });

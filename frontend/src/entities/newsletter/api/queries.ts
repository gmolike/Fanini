// frontend/src/entities/public/newsletter/api/queries.ts
import { createSimpleRemoteQuery } from '@/shared/api';

import { newsletterDetailResponseSchema, newsletterListResponseSchema } from '../model/schemas';

import type { NewsletterDetailResponse, NewsletterListResponse } from '../model/types';

export const useNewsletterList = createSimpleRemoteQuery<NewsletterListResponse>({
  queryKey: ['newsletter', 'list'],
  endpoint: '/api/public/newsletter/list',
  schema: newsletterListResponseSchema,
  staleTime: 1000 * 60 * 10,
});

export const useNewsletterDetail = (newsletterId: string | null, options?: { enabled?: boolean }) =>
  createSimpleRemoteQuery<NewsletterDetailResponse>({
    queryKey: ['newsletter', 'detail', newsletterId ?? ''],
    endpoint: newsletterId ? `/api/public/newsletter/${newsletterId}` : '/api/public/newsletter/',
    schema: newsletterDetailResponseSchema,
    staleTime: 1000 * 60 * 30,
    enabled: !!newsletterId && options?.enabled !== false,
    ...options,
  });

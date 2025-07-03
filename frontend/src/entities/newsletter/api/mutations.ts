// frontend/src/entities/public/newsletter/api/mutations.ts
import { useMutation } from '@tanstack/react-query';
import { type z } from 'zod';

import { api } from '@/shared/api';

import { type newsletterSubscriptionSchema } from '../model/schemas';

export const useNewsletterSubscription = () => {
  return useMutation({
    mutationFn: async (data: z.infer<typeof newsletterSubscriptionSchema>) => {
      const response = await api.post('/api/public/newsletter/subscribe', data);
      return response.data;
    },
  });
};

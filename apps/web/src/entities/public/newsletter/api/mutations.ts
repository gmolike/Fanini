// frontend/src/entities/public/newsletter/api/mutations.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { type z } from 'zod';

import { apiClient, ApiClientError } from '@/shared/api';

import { newsletterSubscriptionSchema } from '../model/schemas';

type SubscriptionData = z.infer<typeof newsletterSubscriptionSchema>;
type SubscriptionResponse = {
  success: boolean;
  message: string;
  confirmationRequired?: boolean;
  subscriberId?: string;
};

export const useNewsletterSubscription = () => {
  const queryClient = useQueryClient();

  return useMutation<SubscriptionResponse, Error, SubscriptionData>({
    mutationFn: async data => {
      const validated = newsletterSubscriptionSchema.parse(data);
      return apiClient.post<SubscriptionResponse>('/api/public/newsletter/subscribe', validated);
    },
    onSuccess: response => {
      // Optional: Cache invalidation falls es eine Subscriber-Liste gibt
      void queryClient.invalidateQueries({ queryKey: ['newsletter', 'subscribers'] });

      if (response.confirmationRequired) {
        toast.success('Erfolgreich angemeldet! Bitte bestätige deine E-Mail-Adresse.');
      } else {
        toast.success('Erfolgreich für den Newsletter angemeldet!');
      }
    },
    onError: error => {
      console.error('Newsletter subscription error:', error);

      // Spezifische Error Messages basierend auf API Error
      if (error instanceof ApiClientError) {
        switch (error.statusCode) {
          case 409:
            toast.error('Diese E-Mail-Adresse ist bereits registriert.');
            break;
          case 422:
            toast.error('Die eingegebenen Daten sind ungültig. Bitte überprüfe deine Eingaben.');
            break;
          case 429:
            toast.error('Zu viele Anfragen. Bitte versuche es später erneut.');
            break;
          default:
            toast.error('Anmeldung fehlgeschlagen. Bitte versuche es später erneut.');
        }
      } else {
        toast.error('Ein unerwarteter Fehler ist aufgetreten.');
      }
    },
  });
};

// Optional: Mutation für Newsletter-Abmeldung
export const useNewsletterUnsubscribe = () => {
  return useMutation<{ success: boolean; message: string }, Error, { token: string }>({
    mutationFn: async ({ token }) => {
      return apiClient.post<{ success: boolean; message: string }>(
        '/api/public/newsletter/unsubscribe',
        {
          token,
        }
      );
    },
    onSuccess: () => {
      toast.success('Du wurdest erfolgreich vom Newsletter abgemeldet.');
    },
    onError: error => {
      console.error('Newsletter unsubscribe error:', error);
      toast.error('Abmeldung fehlgeschlagen. Bitte versuche es später erneut.');
    },
  });
};

// Optional: Mutation für E-Mail-Bestätigung
export const useConfirmNewsletterSubscription = () => {
  return useMutation<{ success: boolean; message: string }, Error, { token: string }>({
    mutationFn: async ({ token }) => {
      return apiClient.post<{ success: boolean; message: string }>(
        '/api/public/newsletter/confirm',
        {
          token,
        }
      );
    },
    onSuccess: () => {
      toast.success(
        'E-Mail-Adresse erfolgreich bestätigt! Du erhältst ab jetzt unseren Newsletter.'
      );
    },
    onError: error => {
      console.error('Newsletter confirmation error:', error);

      if (error instanceof ApiClientError && error.statusCode === 410) {
        toast.error('Der Bestätigungslink ist abgelaufen. Bitte melde dich erneut an.');
      } else {
        toast.error('Bestätigung fehlgeschlagen. Bitte versuche es später erneut.');
      }
    },
  });
};

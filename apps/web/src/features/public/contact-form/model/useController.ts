// frontend/src/features/public/contact-form/model/useController.ts
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

import { contactFormSchema } from './schemas';

import type { ContactFormValues } from './types';

/**
 * Controller hook for the contact form
 *
 * @returns Form instance and submission handler
 */
export const useController = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      recipientType: 'general',
      subject: '',
      message: '',
      detailedDescription: '',
      privacyConsent: false,
    },
    mode: 'onChange',
  });

  const recipientType = form.watch('recipientType');
  const selectedTeam = form.watch('selectedTeam');
  const selectedCommittee = form.watch('selectedCommittee');

  const handleSubmit = async (data: ContactFormValues) => {
    setIsSubmitting(true);

    try {
      // API call would go here
      console.log('Submitting contact form:', data);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      toast.success('Deine Nachricht wurde erfolgreich gesendet!');
      form.reset();
    } catch (error) {
      console.error('Contact form error:', error);
      toast.error('Fehler beim Senden. Bitte versuche es später erneut.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    recipientType,
    selectedTeam,
    selectedCommittee,
    isSubmitting,
    handleSubmit,
  };
};

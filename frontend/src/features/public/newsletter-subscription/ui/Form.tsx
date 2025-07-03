// frontend/src/features/public/newsletter-subscription/ui/Form.tsx
import { useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Mail } from 'lucide-react';
import { toast } from 'sonner';
import { type z } from 'zod';

import {
  newsletterSubscriptionSchema,
  useNewsletterSubscription,
} from '@/entities/public/newsletter';

import {
  Button,
  Checkbox,
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from '@/shared/shadcn';

type FormValues = z.infer<typeof newsletterSubscriptionSchema>;

export const SubscriptionForm = () => {
  const subscription = useNewsletterSubscription();

  const form = useForm<FormValues>({
    resolver: zodResolver(newsletterSubscriptionSchema),
    defaultValues: {
      email: '',
      firstName: '',
      lastName: '',
      acceptsMarketing: false,
    },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      await subscription.mutateAsync(data);
      toast.success('Erfolgreich angemeldet! Bitte bestätige deine E-Mail-Adresse.');
      form.reset();
    } catch (error) {
      toast.error('Anmeldung fehlgeschlagen. Bitte versuche es später erneut.');
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Vorname</FormLabel>
                <FormControl>
                  <Input placeholder="Max" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nachname (optional)</FormLabel>
                <FormControl>
                  <Input placeholder="Mustermann" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>E-Mail-Adresse</FormLabel>
              <FormControl>
                <div className="relative">
                  <Mail className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                  <Input placeholder="max@example.com" className="pl-10" {...field} />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="acceptsMarketing"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-y-0 space-x-3">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Newsletter-Empfang bestätigen</FormLabel>
                <FormDescription>
                  Ich möchte regelmäßig Updates und Neuigkeiten der Faninitiative Spandau erhalten.
                  Du kannst dich jederzeit abmelden.
                </FormDescription>
              </div>
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={subscription.isPending}>
          {subscription.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Anmeldung läuft...
            </>
          ) : (
            <>
              <Mail className="mr-2 h-4 w-4" />
              Newsletter abonnieren
            </>
          )}
        </Button>
      </form>
    </Form>
  );
};

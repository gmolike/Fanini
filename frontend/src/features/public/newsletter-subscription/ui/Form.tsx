// frontend/src/features/public/newsletter-subscription/ui/Form.tsx
import { useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Check, Loader2, Mail, User } from 'lucide-react';
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
      form.reset();
    } catch (error) {
      console.error(error);
    }
  };

  const { isSuccess } = subscription;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {!isSuccess ? (
          <>
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground">Vorname</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <User className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                        <Input
                          placeholder="Max"
                          className="bg-background/80 dark:bg-background/80 border-border pl-10"
                          {...field}
                        />
                      </div>
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
                    <FormLabel className="text-foreground">Nachname (optional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Mustermann"
                        className="bg-background/80 dark:bg-background/80 border-border"
                        {...field}
                      />
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
                  <FormLabel className="text-foreground">E-Mail-Adresse</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                      <Input
                        type="email"
                        placeholder="max@example.com"
                        className="bg-background/80 dark:bg-background/80 border-border pl-10"
                        {...field}
                      />
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
                <FormItem className="bg-muted/30 dark:bg-muted/20 flex flex-row items-start space-y-0 space-x-3 rounded-lg p-4">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="text-foreground text-sm font-medium">
                      Newsletter-Empfang bestätigen
                    </FormLabel>
                    <p className="text-muted-foreground text-sm">
                      Ich möchte regelmäßig Updates der Faninitiative Spandau erhalten.
                    </p>
                  </div>
                </FormItem>
              )}
            />

            <motion.div whileTap={{ scale: 0.98 }}>
              <Button
                type="submit"
                className="w-full bg-[var(--color-fanini-blue)] text-white hover:bg-[var(--color-fanini-blue)]/90"
                disabled={subscription.isPending}
              >
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
            </motion.div>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="py-8 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.2 }}
              className="mb-4 inline-flex rounded-full bg-green-100 p-4 dark:bg-green-900/30"
            >
              <Check className="h-8 w-8 text-green-600 dark:text-green-400" />
            </motion.div>
            <h4 className="text-foreground mb-2 text-lg font-semibold">Erfolgreich angemeldet!</h4>
            <p className="text-muted-foreground">Bitte bestätige deine E-Mail-Adresse.</p>
          </motion.div>
        )}
      </form>
    </Form>
  );
};

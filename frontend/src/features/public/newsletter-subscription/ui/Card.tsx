// frontend/src/features/public/newsletter-subscription/ui/Card.tsx
import { Mail, Newspaper } from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/shadcn';

import { SubscriptionForm } from './Form';

export const SubscriptionCard = () => {
  return (
    <Card className="border-[var(--color-fanini-blue)]/20 bg-gradient-to-br from-[var(--color-fanini-blue)]/5 to-transparent">
      <CardHeader>
        <div className="mb-4 flex items-center gap-3">
          <div className="rounded-lg bg-[var(--color-fanini-blue)] p-3 text-white">
            <Newspaper className="h-6 w-6" />
          </div>
          <Mail className="h-8 w-8 text-[var(--color-fanini-blue)]" />
        </div>
        <CardTitle className="text-2xl">Fanini-Newsletter abonnieren</CardTitle>
        <CardDescription className="text-base">
          Bleib auf dem Laufenden mit unseren regelmäßigen Updates zu Events, Team-News und
          Community-Highlights. Kostenlos und jederzeit abbestellbar.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <SubscriptionForm />
      </CardContent>
    </Card>
  );
};

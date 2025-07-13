// frontend/src/routes/_public/newsletter.$newsletterId.tsx
import { createFileRoute, useParams } from '@tanstack/react-router';
import { Loader2 } from 'lucide-react';

import { NewsletterDetailView } from '@/features/public/newsletter-detail';

import { useNewsletterDetail } from '@/entities/public/newsletter';

import { GlassCard, LoadingState } from '@/shared/ui';

export const Route = createFileRoute('/_public/newsletter/$newsletterId')({
  component: NewsletterDetail,
});

function NewsletterDetail() {
  const params = useParams({ strict: false });
  const { newsletterId } = params;

  const newsletterQuery = useNewsletterDetail(newsletterId);

  return (
    <LoadingState
      query={newsletterQuery}
      loadingFallback={
        <div className="flex min-h-screen items-center justify-center">
          <GlassCard className="p-8">
            <Loader2 className="h-8 w-8 animate-spin text-[var(--color-fanini-blue)]" />
          </GlassCard>
        </div>
      }
    >
      {response => <NewsletterDetailView newsletter={response.data} />}
    </LoadingState>
  );
}

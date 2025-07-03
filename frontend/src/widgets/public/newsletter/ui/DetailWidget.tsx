// frontend/src/widgets/public/newsletter/ui/DetailWidget.tsx
import { Loader2 } from 'lucide-react';

import { NewsletterDetailView } from '@/features/public/newsletter-detail';

import { useNewsletterDetail } from '@/entities/public/newsletter';

import { GlassCard, LoadingState } from '@/shared/ui';

type NewsletterDetailWidgetProps = {
  newsletterId: string;
};

export const NewsletterDetailWidget = ({ newsletterId }: NewsletterDetailWidgetProps) => {
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
};

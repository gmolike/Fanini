// frontend/src/widgets/public/newsletter/ui/DetailWidget.tsx
import { useParams } from '@tanstack/react-router';

import { NewsletterDetailView } from '@/features/public/newsletter-detail';

import { useNewsletterDetail } from '@/entities/public/newsletter';

import { LoadingState, PageSection } from '@/shared/ui';

export const NewsletterDetailWidget = () => {
  const { newsletterId } = useParams({ from: '/newsletter/$newsletterId' });
  const newsletterQuery = useNewsletterDetail(newsletterId);

  return (
    <PageSection className="py-8">
      <LoadingState query={newsletterQuery}>
        {response => <NewsletterDetailView newsletter={response.data} />}
      </LoadingState>
    </PageSection>
  );
};

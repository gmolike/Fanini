// frontend/src/widgets/public/newsletter/ui/DetailWidget.tsx
import { useParams } from '@tanstack/react-router';

import { NewsletterDetailView } from '@/features/public/newsletter-detail';

import { useNewsletterDetail } from '@/entities/public/newsletter';

import { LoadingState } from '@/shared/ui';
import { PageSection } from '@/shared/ui/layout';

export const NewsletterDetailWidget = () => {
  const { newsletterId } = useParams({ from: '/_public/newsletter/$newsletterId' });
  const newsletterQuery = useNewsletterDetail(newsletterId);

  return (
    <PageSection className="py-8">
      <LoadingState query={newsletterQuery()}>
        {response => <NewsletterDetailView newsletter={response.data} />}
      </LoadingState>
    </PageSection>
  );
};

// frontend/src/widgets/public/newsletter/ui/DetailWidget.tsx
import { useParams } from '@tanstack/react-router';

import { NewsletterDetailView } from '@/features/public/newsletter-detail';

import { useNewsletterDetail } from '@/entities/public/newsletter';

import { LoadingState, PageSection } from '@/shared/ui';

// frontend/src/widgets/public/newsletter/ui/DetailWidget.tsx// frontend/src/widgets/public/newsletter/ui/DetailWidget.tsx
export const NewsletterDetailWidget = () => {
  const { newsletterId } = useParams({ from: '/_public/newsletter/$newsletterId' });

  console.log('Newsletter ID from params:', newsletterId);

  // Hook muss AUFGERUFEN werden mit ()
  const newsletterQuery = useNewsletterDetail(newsletterId)(); // <- Beachte die ()

  return (
    <PageSection className="py-8">
      <LoadingState query={newsletterQuery}>
        {response => <NewsletterDetailView newsletter={response.data} />}
      </LoadingState>
    </PageSection>
  );
};

// frontend/src/widgets/public/newsletter/ui/Widget.tsx
import { NewsletterListView } from '@/features/public/newsletter-list';
import { NewsletterSubscriptionCard } from '@/features/public/newsletter-subscription';

import { PageHeader, PageSection } from '@/shared/ui/layout';

export const NewsletterWidget = () => {
  return (
    <>
      <PageHeader
        title="Fanini-Newsletter"
        description="Alle Updates, Team-News und Community-Highlights in einem Format"
        variant="hero"
      />

      <PageSection>
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Newsletter List */}
          <div className="lg:col-span-2">
            <NewsletterListView />
          </div>

          {/* Subscription Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-4">
              <NewsletterSubscriptionCard />
            </div>
          </div>
        </div>
      </PageSection>
    </>
  );
};

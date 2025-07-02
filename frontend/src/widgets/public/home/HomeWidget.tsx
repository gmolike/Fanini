import { EventsPreview } from '@/features/public/event-preview';
import { Hero } from '@/features/public/home-hero';
import { Stats } from '@/features/public/home-stats';

import { PageSection } from '@/shared/ui/layout';

export const HomeWidget = () => {
  return (
    <>
      <Hero />
      <PageSection variant="muted">
        <Stats />
      </PageSection>
      <PageSection>
        <EventsPreview />
      </PageSection>
    </>
  );
};

// frontend/src/widgets/public/home/HomeWidget.tsx
import { DiscordSection } from '@/features/public/home-discord';
import { Hero } from '@/features/public/home-hero';
import { JoinSection } from '@/features/public/home-join';
import { NavigationPreview } from '@/features/public/home-navigation';
import { Stats } from '@/features/public/home-stats';
import { NewsletterSubscriptionCard } from '@/features/public/newsletter-subscription';

import { Container } from '@/shared/ui';

/**
 * Home Widget
 * @description Hauptwidget für die Homepage mit allen Sections
 */
export const HomeWidget = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Hero />

      {/* Stats Section */}
      <Stats />

      {/* Discord Section */}
      <section className="bg-gradient-to-br from-[var(--color-fanini-blue)]/5 via-transparent to-[var(--color-fanini-red)]/5 py-20">
        <Container>
          <DiscordSection />
        </Container>
      </section>

      {/* Join Section */}
      <JoinSection />

      {/* Navigation Preview */}
      <NavigationPreview />

      {/* Newsletter Subscription */}
      <section className="bg-[var(--color-muted)] py-20">
        <Container>
          <div className="mx-auto max-w-2xl">
            <NewsletterSubscriptionCard />
          </div>
        </Container>
      </section>
    </div>
  );
};

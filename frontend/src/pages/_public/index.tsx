import { createFileRoute } from '@tanstack/react-router';

import { EventsPreview, Hero, Stats } from '@/widgets/public/home';

export const Route = createFileRoute('/_public/')({
  component: HomePage,
});

function HomePage() {
  return (
    <>
      <Hero />
      <Stats />
      <EventsPreview />
    </>
  );
}

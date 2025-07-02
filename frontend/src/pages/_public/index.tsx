import { createFileRoute } from '@tanstack/react-router';

import { Hero, Stats } from '@/widgets/public/home';

import { EventsPreview } from '@/features/public/event-preview';

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

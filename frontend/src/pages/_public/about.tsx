import { createFileRoute } from '@tanstack/react-router';

import { AboutWidget } from '@/widgets/public/about';

export const Route = createFileRoute('/_public/about')({
  component: AboutPage,
});

function AboutPage() {
  return <AboutWidget />;
}

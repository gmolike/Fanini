// frontend/src/pages/_public/newsletter.tsx
import { createFileRoute } from '@tanstack/react-router';

import { NewsletterWidget } from '@/widgets/public/newsletter';

export const Route = createFileRoute('/_public/newsletter')({
  component: RouteComponent,
});

function RouteComponent() {
  return <NewsletterWidget />;
}

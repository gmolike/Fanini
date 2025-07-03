// frontend/src/pages/_public/newsletter/$newsletterId.tsx
import { createFileRoute } from '@tanstack/react-router';

import { NewsletterDetailWidget } from '@/widgets/public/newsletter';

export const Route = createFileRoute('/_public/newsletter/$newsletterId')({
  component: RouteComponent,
});

function RouteComponent() {
  return <NewsletterDetailWidget />;
}

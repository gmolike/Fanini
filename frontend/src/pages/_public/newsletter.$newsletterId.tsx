// frontend/src/routes/newsletter.$newsletterId.tsx
import { createFileRoute } from '@tanstack/react-router';

import { NewsletterDetailWidget } from '@/widgets/public/newsletter';

export const Route = createFileRoute('/_public/newsletter/$newsletterId')({
  component: NewsletterDetailWidget,
});

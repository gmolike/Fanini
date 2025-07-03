// frontend/src/pages/_public/newsletter.tsx
import { createFileRoute, Outlet } from '@tanstack/react-router';

import { NewsletterWidget } from '@/widgets/public/newsletter';

export const Route = createFileRoute('/_public/newsletter')({
  component: NewsletterLayout,
});

function NewsletterLayout() {
  // Prüfe ob es einen newsletterId Parameter gibt
  const params = Route.useParams();

  // Wenn kein newsletterId, zeige die Liste
  if (!params.newsletterId) {
    return <NewsletterWidget />;
  }

  // Sonst zeige das Outlet (Detail-View)
  return <Outlet />;
}

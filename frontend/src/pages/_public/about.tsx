// pages/_public/about.tsx
import { createFileRoute, Outlet, useParams } from '@tanstack/react-router';

import { OrganizationWidget } from '@/widgets/public/organization';

export const Route = createFileRoute('/_public/about')({
  component: AboutLayout,
});

function AboutLayout() {
  const params = useParams({ strict: false });

  // Wenn kein gremiumId, zeige die Liste
  if (!params.gremiumId) {
    return <OrganizationWidget />;
  }

  // Sonst zeige das Outlet (Detail-View)
  return <Outlet />;
}

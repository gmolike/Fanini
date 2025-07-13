// frontend/src/pages/_public/about.index.tsx
import { createFileRoute } from '@tanstack/react-router';

import { OrganizationWidget } from '@/widgets/public/organization';

export const Route = createFileRoute('/_public/about/')({
  component: AboutIndex,
});

function AboutIndex() {
  return <OrganizationWidget />;
}

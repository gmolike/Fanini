// frontend/src/pages/_public/dokumente.struktur.tsx
import { createFileRoute } from '@tanstack/react-router';

import { OrganizationStructureWidget } from '@/widgets/public/organization-structure';

export const Route = createFileRoute('/_public/dokumente/struktur')({
  component: StrukturPage,
});

function StrukturPage() {
  return <OrganizationStructureWidget />;
}

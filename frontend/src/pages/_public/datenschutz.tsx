import { createFileRoute } from '@tanstack/react-router';

import { LegalContent } from '@/widgets/public/legal';

export const Route = createFileRoute('/_public/datenschutz')({
  component: DatenschutzPage,
});

function DatenschutzPage() {
  return <LegalContent type="datenschutz" />;
}

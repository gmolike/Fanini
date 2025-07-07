import { createFileRoute } from '@tanstack/react-router';

import { LegalContent } from '@/widgets/public/legal';

export const Route = createFileRoute('/_public/impressum')({
  component: ImpressumPage,
});

function ImpressumPage() {
  return <LegalContent type="impressum" />;
}

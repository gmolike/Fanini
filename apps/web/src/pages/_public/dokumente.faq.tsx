// frontend/src/pages/_public/dokumente.faq.tsx
import { createFileRoute } from '@tanstack/react-router';

import { FaqWidget } from '@/widgets/public/faq';

export const Route = createFileRoute('/_public/dokumente/faq')({
  component: FaqPage,
});

function FaqPage() {
  return <FaqWidget />;
}

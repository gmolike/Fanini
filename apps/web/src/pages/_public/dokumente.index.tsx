// frontend/src/pages/_public/dokumente.index.tsx (KORRIGIERT)
import { createFileRoute } from '@tanstack/react-router';

import { DocumentWidget } from '@/widgets/public/document';

export const Route = createFileRoute('/_public/dokumente/')({
  component: DokumenteIndex,
});

function DokumenteIndex() {
  return <DocumentWidget />;
}

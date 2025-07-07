// pages/_public/kreativ.index.tsx
import { createFileRoute } from '@tanstack/react-router';

import { CreatorWidget } from '@/widgets/public/creator';

export const Route = createFileRoute('/_public/kreativ/')({
  component: KreativIndex,
});

function KreativIndex() {
  return <CreatorWidget />;
}

import { createFileRoute } from '@tanstack/react-router';

import { FeatureRequestWidget } from '@/widgets/internal/feature-request';

export const Route = createFileRoute('/intern/dev/features')({
  component: FeaturesPage,
});

function FeaturesPage() {
  return <FeatureRequestWidget />;
}

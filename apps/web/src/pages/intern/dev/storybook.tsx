import { createFileRoute } from '@tanstack/react-router';

import { StorybookViewer } from '@/widgets/internal/storybook-viewer';

export const Route = createFileRoute('/intern/dev/storybook')({
  component: StorybookPage,
});

function StorybookPage() {
  return <StorybookViewer />;
}

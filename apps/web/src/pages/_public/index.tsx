import { createFileRoute } from '@tanstack/react-router';

import { HomeWidget } from '@/widgets/public/home';

export const Route = createFileRoute('/_public/')({
  component: HomePage,
});

function HomePage() {
  return <HomeWidget />;
}

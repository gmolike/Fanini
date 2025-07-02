// frontend/src/pages/_public/historie.tsx
import { createFileRoute } from '@tanstack/react-router';

import { TeamHistoryWidgets } from '@/widgets/public/team-history';

import { PageHeader, PageSection } from '@/shared/ui/layout';

export const Route = createFileRoute('/_public/historie')({
  component: HistoriePage,
});

function HistoriePage() {
  return (
    <>
      <PageHeader
        title="Vereinshistorie"
        description="Die Geschichte der Teams und besonderen Momente"
        variant="hero"
      />

      <PageSection>
        <TeamHistoryWidgets />
      </PageSection>
    </>
  );
}

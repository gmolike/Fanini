// frontend/src/pages/~_public/~kontakt.tsx
import { createFileRoute } from '@tanstack/react-router';

import { Container } from '@/shared/ui/layout/Container';

import { DemoTable } from '../../../demo/DemoTable';

export const Route = createFileRoute('/_public/kontakt')({
  component: KontaktPage,
});

function KontaktPage() {
  return (
    <Container className="py-16">
      <h1 className="font-[Bebas_Neue] text-3xl text-[var(--color-fanini-blue)]">Kontakt</h1>
      <DemoTable />
    </Container>
  );
}

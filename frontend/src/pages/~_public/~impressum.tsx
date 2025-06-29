// frontend/src/pages/~_public/~impressum.tsx
import { createFileRoute } from '@tanstack/react-router';

import { Container } from '@/shared/ui/layout/Container';

export const Route = createFileRoute('/_public/impressum')({
  component: ImpressumPage,
});

function ImpressumPage() {
  return (
    <Container className='py-16'>
      <h1 className='font-[Bebas_Neue] text-3xl text-[var(--color-fanini-blue)]'>Impressum</h1>
      {/* Impressum-Inhalt */}
    </Container>
  );
}

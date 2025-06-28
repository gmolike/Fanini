// frontend/src/pages/~_public/~datenschutz.tsx
import { createFileRoute } from '@tanstack/react-router';
import { Container } from '@/shared/ui/layout/Container';

export const Route = createFileRoute('/_public/datenschutz')({
  component: DatenschutzPage,
});

function DatenschutzPage() {
  return (
    <Container className='py-16'>
      <h1 className='font-[Bebas_Neue] text-3xl text-[var(--color-fanini-blue)]'>Datenschutz</h1>
      {/* Datenschutz-Inhalt */}
    </Container>
  );
}

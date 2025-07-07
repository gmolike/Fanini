// frontend/src/pages/_public/kontakt.tsx
import { createFileRoute } from '@tanstack/react-router';

import { ContactForm } from '@/features/public/contact-form';

import { Container } from '@/shared/ui';

export const Route = createFileRoute('/_public/kontakt')({
  component: KontaktPage,
});

function KontaktPage() {
  return (
    <Container className="py-16">
      <ContactForm />
    </Container>
  );
}

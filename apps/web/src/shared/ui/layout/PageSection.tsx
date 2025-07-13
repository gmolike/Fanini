// frontend/src/shared/ui/layout/PageSection.tsx
import { cn } from '@/shared/lib';
import { Container } from '@/shared/ui';

type PageSectionProps = {
  children: React.ReactNode;
  variant?: 'default' | 'muted' | 'accent';
  className?: string;
};

/**
 * PageSection Component
 * @description Konsistente Section-Komponente für Seiten
 * @param variant - Styling-Variante: default, muted oder accent
 * @param className - Zusätzliche CSS-Klassen
 */
export const PageSection = ({ children, variant = 'default', className }: PageSectionProps) => {
  const variants = {
    default: 'bg-background',
    muted: 'bg-muted',
    accent: 'bg-accent/5',
  };

  return (
    <section className={cn('py-16', variants[variant], className)}>
      <Container>{children}</Container>
    </section>
  );
};

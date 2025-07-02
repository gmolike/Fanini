// frontend/src/shared/ui/layout/PageLayout.tsx
import { cn } from '@/shared/lib';
import { Container } from '@/shared/ui/layout/Container';

type PageLayoutProps = {
  children: React.ReactNode;
  className?: string;
};

/**
 * PageLayout Component
 * @description Standard-Layout für alle öffentlichen Seiten
 */
export const PageLayout = ({ children, className }: PageLayoutProps) => {
  return <div className={cn('bg-background min-h-screen', className)}>{children}</div>;
};

// frontend/src/shared/ui/layout/PageSection.tsx
type PageSectionProps = {
  children: React.ReactNode;
  variant?: 'default' | 'muted' | 'accent';
  className?: string;
};

/**
 * PageSection Component
 * @description Konsistente Section-Komponente für Seiten
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

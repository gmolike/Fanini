import { cn } from '@/shared/lib';
import { Container } from '@/shared/ui';

import type { PageHeaderProps } from './model/types';

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  breadcrumb,
  actions,
  variant = 'default',
  className,
}) => {
  const variantClasses = {
    default: 'bg-background border-b',
    hero: 'bg-gradient-to-r from-[var(--color-fanini-blue)] to-[var(--color-fanini-blue)]/90 text-white dark:text-white', // explizit für dark mode
    minimal: 'bg-transparent',
  };

  return (
    <header className={cn('py-8', variantClasses[variant], className)}>
      <Container>
        {breadcrumb != null ? <div className="mb-4">{breadcrumb}</div> : null}

        <div className="flex items-start justify-between">
          <div className="min-w-0 flex-1">
            <h1
              className={cn(
                'text-3xl font-bold tracking-tight',
                variant === 'hero'
                  ? 'text-white dark:text-white' // Weiß in beiden Modi
                  : 'text-foreground' // Standard: schwarz/weiß je nach Mode
              )}
            >
              {title}
            </h1>
            {description ? (
              <p
                className={cn(
                  'mt-2 text-lg',
                  variant === 'hero' ? 'text-white/90 dark:text-white/90' : 'text-muted-foreground'
                )}
              >
                {description}
              </p>
            ) : null}
          </div>

          {actions != null ? <div className="ml-4 flex items-center gap-3">{actions}</div> : null}
        </div>
      </Container>
    </header>
  );
};

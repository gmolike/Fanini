import * as React from 'react';

import { cn } from '@/shared/lib';

import { Container } from '../Container';

import type { PageHeaderProps } from './model/types';

/**
 * PageHeader Komponente
 * @description Einheitlicher Seitenkopf mit Titel, Beschreibung und Actions
 */
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
    hero: 'bg-gradient-to-r from-fanini-blue-500 to-fanini-blue-600 text-white',
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
                variant === 'hero' ? 'text-white' : 'text-foreground'
              )}
            >
              {title}
            </h1>
            {description ? (
              <p
                className={cn(
                  'mt-2 text-lg',
                  variant === 'hero' ? 'text-white/90' : 'text-muted-foreground'
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

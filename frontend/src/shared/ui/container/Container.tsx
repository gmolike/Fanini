// frontend/src/shared/ui/container/Container.tsx
import * as React from 'react';

import { cn } from '@/shared/lib';

import type { ContainerProps } from './types';

/**
 * Container Komponente
 * @description Responsive Container mit max-width und Padding
 * @param {ContainerSize} size - Container-Größe: sm, default, lg, xl, full
 * @param {string} className - Zusätzliche CSS-Klassen
 * @param {ElementType} as - HTML-Element (default: div)
 * @example
 * ```tsx
 * <Container size="lg">
 *   <Content />
 * </Container>
 * ```
 */
export const Container: React.FC<ContainerProps> = ({
  children,
  size = 'default',
  className,
  as: Component = 'div',
}) => {
  const sizeClasses = {
    sm: 'max-w-3xl',
    default: 'max-w-5xl',
    lg: 'max-w-7xl',
    xl: 'max-w-screen-xl',
    full: 'max-w-none',
  };

  return (
    <Component className={cn('mx-auto w-full px-4 sm:px-6 lg:px-8', sizeClasses[size], className)}>
      {children}
    </Component>
  );
};

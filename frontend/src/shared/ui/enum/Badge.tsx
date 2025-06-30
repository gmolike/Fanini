import * as React from 'react';

import { Slot } from '@radix-ui/react-slot';

import { cn } from '@/shared/lib';

import { badgeVariants } from './model/badgeVariants';
import { getEnumConfig } from './model/utils';

import type { BaseEnumProps } from './model/types';
import type { VariantProps } from 'class-variance-authority';

export function EnumBadge<T extends Record<string, string | number>>({
  value,
  config,
  className,
  size,
  asChild = false,
  ...props
}: Readonly<EnumBadgeProps<T>>) {
  const Comp = asChild ? Slot : 'span';
  const enumConfig = getEnumConfig(value, config.variants, config.enumObj);

  if (!enumConfig) {
    // Sollte mit StrictEnumConfig nie passieren
    return null;
  }

  const { label, variant = 'default' } = enumConfig;

  return (
    <Comp
      className={cn(badgeVariants({ variant, size }), className)}
      data-testid="enum-badge"
      data-variant={variant}
      data-value={String(value)}
      {...props}
    >
      {label}
    </Comp>
  );
}

/**
 * EnumBadge Component
 * @description Type-safe Badge-Komponente für Enum-Werte mit CVA-Styling
 * @param value - Der Enum-Key oder -Value
 * @param config - Config mit optionalen Labels und Varianten
 * @param size - Badge-Größe: 'sm' | 'md' | 'lg'
 * @param asChild - Rendert als Slot für Composition
 * @param className - Zusätzliche CSS-Klassen
 * @example
 * ```tsx
 * Minimal - nur Varianten
 * const statusConfig = createEnumVariantConfig(Status, {
 *   ACTIVE: 'success',
 *   INACTIVE: 'default'
 * });
 *
 * <EnumBadge value={Status.ACTIVE} config={statusConfig} enumObj={Status} />
 * ```
 */
export type EnumBadgeProps<T extends Record<string, string | number>> = {
  asChild?: boolean;
} & BaseEnumProps<T> &
  Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> &
  Omit<VariantProps<typeof badgeVariants>, 'variant'>;

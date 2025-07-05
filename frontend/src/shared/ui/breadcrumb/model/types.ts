// frontend/src/shared/ui/breadcrumb/types.ts
import type { ComponentType } from 'react';

export type BreadcrumbItem = {
  label: string;
  href?: string;
  icon?: ComponentType<{ className?: string }>;
};

export type BreadcrumbProps = {
  items: BreadcrumbItem[];
  className?: string;
  separator?: ComponentType<{ className?: string }>;
  showHomeIcon?: boolean;
  variant?: BreadcrumbVariant;
};

export type BreadcrumbVariant = 'default' | 'compact' | 'large';

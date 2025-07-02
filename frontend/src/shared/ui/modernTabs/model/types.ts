import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

export type ModernTabItem = {
  value: string;
  label: string;
  shortLabel?: string;
  icon?: LucideIcon;
  content: ReactNode;
};

export type ModernTabsProps = {
  items: ModernTabItem[];
  defaultValue: string;
  className?: string;
  variant?: 'default' | 'pills';
};

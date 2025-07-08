import * as React from 'react';

import { cn } from '@/shared/lib';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/shadcn';

import type { ModernTabsProps } from './model/types';

/**
 * ModernTabs Component
 * @description Moderne Tab-Navigation ohne starke Borders, volle Breite
 * @param items - Array von Tab-Items mit value, label, icon und content
 * @param defaultValue - Standard-Tab der aktiv sein soll
 * @param className - Zusätzliche CSS-Klassen für den Container
 * @param variant - Stil-Variante: default oder pills
 */
export const ModernTabs: React.FC<ModernTabsProps> = ({
  items,
  defaultValue,
  className,
  variant = 'default',
}) => {
  const variantStyles = {
    default: {
      list: 'bg-transparent border-b h-auto p-0 rounded-none gap-0',
      trigger:
        'rounded-none border-b-2 border-transparent pb-3 data-[state=active]:border-[var(--color-fanini-blue)] data-[state=active]:text-[var(--color-fanini-blue)] transition-all duration-200 hover:text-[var(--color-fanini-blue)]/80',
    },
    pills: {
      list: 'bg-[var(--color-muted)] h-auto p-1 rounded-lg gap-1',
      trigger:
        'rounded-md data-[state=active]:bg-white dark:data-[state=active]:bg-[var(--color-card)] data-[state=active]:shadow-sm transition-all duration-200',
    },
  };

  const styles = variantStyles[variant];

  // Dynamische Grid-Columns
  const gridCols =
    {
      1: 'grid-cols-1',
      2: 'grid-cols-2',
      3: 'grid-cols-3',
      4: 'grid-cols-4',
      5: 'grid-cols-5',
      6: 'grid-cols-6',
    }[items.length] ?? 'grid-cols-4';

  return (
    <Tabs defaultValue={defaultValue} className={cn('w-full', className)}>
      <TabsList className={cn('grid w-full', gridCols, styles.list)}>
        {items.map(item => (
          <TabsTrigger
            key={item.value}
            value={item.value}
            className={cn(
              'flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium',
              styles.trigger
            )}
          >
            {item.icon ? <item.icon className="h-4 w-4" /> : null}
            <span className="hidden sm:inline">{item.label}</span>
            <span className="sm:hidden">{item.shortLabel ?? item.label}</span>
          </TabsTrigger>
        ))}
      </TabsList>

      {items.map(item => (
        <TabsContent key={item.value} value={item.value} className="mt-6">
          {item.content}
        </TabsContent>
      ))}
    </Tabs>
  );
};

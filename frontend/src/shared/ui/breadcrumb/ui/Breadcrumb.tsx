import * as React from 'react';

import { ChevronRight } from 'lucide-react';

import { cn } from '@/shared/lib';

import { BreadcrumbItem } from './Item';

import type { BreadcrumbProps } from '../model/types';

export const Breadcrumb: React.FC<BreadcrumbProps> = ({
  items,
  className,
  separator: Separator = ChevronRight,
  showHomeIcon = true,
  variant = 'default',
}) => {
  if (items.length === 0) return null;

  const variantClasses = {
    default: 'text-sm',
    compact: 'text-xs',
    large: 'text-base',
  };

  return (
    <nav
      aria-label="Breadcrumb"
      className={cn('flex items-center space-x-2', variantClasses[variant], className)}
    >
      <ol className="flex items-center space-x-2">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const isFirst = index === 0;

          return (
            <li key={`${item.label}-${index.toString()}`} className="flex items-center">
              {/* Separator */}
              {index > 0 && (
                <Separator
                  className="text-muted-foreground mx-2 h-4 w-4 flex-shrink-0"
                  aria-hidden="true"
                />
              )}

              {/* Breadcrumb Item */}
              <BreadcrumbItem
                item={item}
                isFirst={isFirst}
                isLast={isLast}
                showHomeIcon={showHomeIcon}
              />
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

import * as React from 'react'

import { Link } from '@tanstack/react-router'
import { ChevronRight, Home } from 'lucide-react'

import { cn } from '@/shared/lib'

import type { BreadcrumbProps } from './model/types'

/**
 * Breadcrumb UI Komponente
 * @description Reine UI-Komponente für Breadcrumb-Navigation
 */
export const Breadcrumb: React.FC<BreadcrumbProps> = ({
  items,
  className,
  separator: Separator = ChevronRight,
  showHomeIcon = true,
  variant = 'default',
}) => {
  if (!items || items.length === 0) return null

  const variantClasses = {
    default: 'text-sm',
    compact: 'text-xs',
    large: 'text-base',
  }

  return (
    <nav
      aria-label="Breadcrumb"
      className={cn('flex items-center space-x-2', variantClasses[variant], className)}
    >
      <ol className="flex items-center space-x-2">
        {items.map((item, index) => {
          const isLast = index === items.length - 1
          const isFirst = index === 0
          const Icon = item.icon

          return (
            <li key={`${item.label}-${index}`} className="flex items-center">
              {/* Separator */}
              {index > 0 && (
                <Separator
                  className="mx-2 h-4 w-4 text-muted-foreground flex-shrink-0"
                  aria-hidden="true"
                />
              )}

              {/* Breadcrumb Item */}
              <div className="flex items-center gap-1.5 min-w-0">
                {/* Icon */}
                {Icon ? <Icon className="h-4 w-4 flex-shrink-0" /> : null}
                {isFirst && showHomeIcon && !Icon ? <Home className="h-4 w-4 text-muted-foreground flex-shrink-0" /> : null}

                {/* Label */}
                {item.href && !isLast ? (
                  <Link
                    to={item.href}
                    className="text-muted-foreground hover:text-foreground transition-colors truncate"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span
                    className={cn(
                      'font-medium truncate',
                      isLast ? 'text-foreground' : 'text-muted-foreground',
                    )}
                  >
                    {item.label}
                  </span>
                )}
              </div>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

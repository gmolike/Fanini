import * as React from 'react'
import { Link } from '@tanstack/react-router'
import { cn } from '@/shared/lib'
import { Badge } from '@/shared/shadcn/badge'
import type { NavigationProps } from '../model/types'

/**
 * Navigation Komponente
 * @description Vertikale oder horizontale Navigation mit Icons und Badges
 */
export const Navigation = ({ items, className, orientation = 'vertical' }: NavigationProps) => {
  return (
    <nav
      className={cn(
        'flex',
        orientation === 'vertical' ? 'flex-col space-y-1' : 'flex-row space-x-4',
        className,
      )}
    >
      {items.map(item => (
        <Link
          key={item.href}
          to={item.href}
          className={cn(
            'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
            'hover:bg-accent hover:text-accent-foreground',
            '[&.active]:bg-accent [&.active]:text-accent-foreground',
          )}
        >
          {item.icon && <item.icon className="h-4 w-4" />}
          <span className="flex-1">{item.label}</span>
          {item.badge && (
            <Badge variant="secondary" className="ml-auto">
              {item.badge}
            </Badge>
          )}
        </Link>
      ))}
    </nav>
  )
}

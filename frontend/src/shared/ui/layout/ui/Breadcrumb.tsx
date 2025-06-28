import * as React from 'react'
import { Link } from '@tanstack/react-router'
import { ChevronRight } from 'lucide-react'
import { cn } from '@/shared/lib'
import type { BreadcrumbProps } from '../model/types'

/**
 * Breadcrumb Komponente
 * @description Breadcrumb-Navigation zur Orientierung
 */
export const Breadcrumb = ({ items, className }: BreadcrumbProps) => {
  if (items.length === 0) return null

  return (
    <nav aria-label="Breadcrumb" className={cn('flex items-center space-x-2 text-sm', className)}>
      {items.map((item, index) => (
        <React.Fragment key={item.label}>
          {index > 0 && <ChevronRight className="h-4 w-4 text-muted-foreground" />}
          {item.href && index < items.length - 1 ? (
            <Link
              to={item.href}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className="font-medium">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  )
}

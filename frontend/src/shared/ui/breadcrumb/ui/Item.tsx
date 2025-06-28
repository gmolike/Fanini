// frontend/src/shared/ui/breadcrumb/ui/BreadcrumbItem.tsx
import * as React from 'react'
import { Link } from '@tanstack/react-router'
import { Home } from 'lucide-react'
import { cn } from '@/shared/lib'
import type { BreadcrumbItem as BreadcrumbItemType } from '../model/types'

type BreadcrumbItemProps = {
  item: BreadcrumbItemType
  isFirst: boolean
  isLast: boolean
  showHomeIcon: boolean
}

export const BreadcrumbItem: React.FC<BreadcrumbItemProps> = ({
  item,
  isFirst,
  isLast,
  showHomeIcon,
}) => {
  const Icon = item.icon

  return (
    <div className="flex items-center gap-1.5 min-w-0">
      {/* Icon */}
      {Icon && <Icon className="h-4 w-4 flex-shrink-0" />}
      {isFirst && showHomeIcon && !Icon && (
        <Home className="h-4 w-4 text-muted-foreground flex-shrink-0" />
      )}

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
  )
}

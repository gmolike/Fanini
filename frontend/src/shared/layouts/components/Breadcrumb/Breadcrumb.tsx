import { Fragment } from 'react'
import { Link } from '@tanstack/react-router'
import { ChevronRight } from 'lucide-react'
import { useBreadcrumb } from './useBreadcrumb'
import { cn } from '@/shared/lib/utils'
import { breadcrumbConfig } from './Breadcrumb.config'

interface BreadcrumbProps {
  className?: string
}

export function Breadcrumb({ className }: BreadcrumbProps) {
  const { segments } = useBreadcrumb()

  if (segments.length === 0) return null

  return (
    <nav className={cn(breadcrumbConfig.container, className)}>
      <ol className={breadcrumbConfig.list}>
        {segments.map((segment, index) => (
          <Fragment key={segment.path || index}>
            {index > 0 && <ChevronRight className={breadcrumbConfig.separator} />}
            <li className={breadcrumbConfig.item}>
              {segment.path && index < segments.length - 1 ? (
                <Link to={segment.path} className={breadcrumbConfig.link}>
                  {segment.label}
                </Link>
              ) : (
                <span className={breadcrumbConfig.current}>{segment.label}</span>
              )}
            </li>
          </Fragment>
        ))}
      </ol>
    </nav>
  )
}

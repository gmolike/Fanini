import { cn } from '@/shared/lib/utils'
import { baseLayoutConfig } from './BaseLayout.config'

interface BaseLayoutProps {
  children: React.ReactNode
  className?: string
  maxWidth?: keyof typeof baseLayoutConfig.maxWidth
}

export function BaseLayout({ children, className, maxWidth = 'default' }: BaseLayoutProps) {
  return (
    <div className={cn(baseLayoutConfig.base, className)}>
      <div className={cn(baseLayoutConfig.container, baseLayoutConfig.maxWidth[maxWidth])}>
        {children}
      </div>
    </div>
  )
}

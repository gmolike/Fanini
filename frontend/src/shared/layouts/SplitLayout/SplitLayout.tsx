import { Outlet } from '@tanstack/react-router'
import { Navigation } from '../components/Navigation'
import { cn } from '@/shared/lib/utils'
import { splitLayoutConfig } from './SplitLayout.config'

interface SplitLayoutProps {
  children?: React.ReactNode
  className?: string
  variant?: keyof typeof splitLayoutConfig.variants
}

export function SplitLayout({ children, className, variant = 'default' }: SplitLayoutProps) {
  const config = splitLayoutConfig.variants[variant]

  return (
    <div className={cn(splitLayoutConfig.base, config.wrapper, className)}>
      <aside className={config.sidebar}>
        <Navigation />
      </aside>
      <main className={config.main}>{children || <Outlet />}</main>
    </div>
  )
}

import { NavigationItem } from './NavigationItem'
import { cn } from '@/shared/lib/utils'
import { navigationConfig } from './Navigation.config'

interface NavigationProps {
  className?: string
  variant?: keyof typeof navigationConfig.variants
}

export function Navigation({ className, variant = 'default' }: NavigationProps) {
  const config = navigationConfig.variants[variant]
  const items = navigationConfig.items

  return (
    <nav className={cn(config.container, className)}>
      <ul className={config.list}>
        {items.map(item => (
          <NavigationItem key={item.path} item={item} variant={variant} />
        ))}
      </ul>
    </nav>
  )
}

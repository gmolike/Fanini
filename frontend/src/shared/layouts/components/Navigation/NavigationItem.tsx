import { Link } from '@tanstack/react-router'
import { Icon } from '@/shared/ui/primitives'
import { cn } from '@/shared/lib/utils'
import { navigationConfig } from './Navigation.config'

interface NavigationItemProps {
  item: {
    label: string
    path: string
    icon: any
  }
  variant?: keyof typeof navigationConfig.variants
}

export function NavigationItem({ item, variant = 'default' }: NavigationItemProps) {
  const config = navigationConfig.variants[variant]

  return (
    <li>
      <Link to={item.path} className={config.item} activeProps={{ className: config.itemActive }}>
        <Icon icon={item.icon} className={config.icon} />
        {variant !== 'compact' && <span>{item.label}</span>}
      </Link>
    </li>
  )
}

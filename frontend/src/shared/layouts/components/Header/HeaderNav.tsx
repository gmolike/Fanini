import { Link } from '@tanstack/react-router'
import { Menu } from 'lucide-react'
import { Button } from '@/shared/ui/components'
import { headerConfig } from './Header.config'

const navItems = [
  { label: 'Über uns', href: '/about' },
  { label: 'Events', href: '/events' },
  { label: 'Kontakt', href: '/contact' },
]

export function HeaderNav() {
  return (
    <>
      <nav className={headerConfig.nav.desktop}>
        {navItems.map(item => (
          <Link
            key={item.href}
            to={item.href}
            className={headerConfig.nav.link}
            activeProps={{ className: headerConfig.nav.linkActive }}
          >
            {item.label}
          </Link>
        ))}
      </nav>
      <Button variant="ghost" size="icon" className={headerConfig.nav.mobile}>
        <Menu className="h-5 w-5" />
      </Button>
    </>
  )
}

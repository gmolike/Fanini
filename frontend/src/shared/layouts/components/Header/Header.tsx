import { Link } from '@tanstack/react-router'
import { HeaderLogo } from './HeaderLogo'
import { HeaderNav } from './HeaderNav'
import { cn } from '@/shared/lib/utils'
import { headerConfig } from './Header.config'

interface HeaderProps {
  className?: string
}

export function Header({ className }: HeaderProps) {
  return (
    <header className={cn(headerConfig.base, className)}>
      <div className={headerConfig.container}>
        <div className={headerConfig.wrapper}>
          <Link to="/" className={headerConfig.logoLink}>
            <HeaderLogo />
          </Link>
          <HeaderNav />
        </div>
      </div>
    </header>
  )
}

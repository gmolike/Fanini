import * as React from 'react'
import { Link } from '@tanstack/react-router'
import { Menu } from 'lucide-react'
import { Button } from '@/shared/shadcn/button'
import { Sheet, SheetContent, SheetTrigger } from '@/shared/shadcn/sheet'
import { Container } from '@/shared/ui/layout/Container'
import { NavLink } from '@/shared/ui/navigation/NavLink'
import { cn } from '@/shared/lib'

const navigationItems = [
  { label: 'Verein', href: '/verein' },
  { label: 'Events', href: '/events' },
  { label: 'Künstler', href: '/kuenstler' },
  { label: 'Rückblicke', href: '/rueckblicke' },
  { label: 'Medien', href: '/medien' },
  { label: 'Kontakt', href: '/kontakt' },
] as const

/**
 * Header Komponente
 * @description Hauptnavigation mit Logo, Desktop/Mobile Navigation und CTA-Buttons
 */
export const Header: React.FC<{ className?: string }> = ({ className }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)

  return (
    <header className={cn('sticky top-0 z-50 border-b bg-background/95 backdrop-blur', className)}>
      <Container>
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-lg font-bold text-primary-foreground">F</span>
            </div>
            <div className="hidden sm:block">
              <div className="font-heading text-xl font-bold text-primary">Faniniative</div>
              <div className="text-xs text-muted-foreground -mt-1">Spandau e.V.</div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navigationItems.map(item => (
              <NavLink key={item.href} to={item.href} variant="ghost" className="px-4 py-2">
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <Button asChild size="sm" className="hidden sm:inline-flex">
              <Link to="/mitglied-werden">Mitglied werden</Link>
            </Button>

            <Button asChild variant="outline" size="sm" className="hidden sm:inline-flex">
              <Link to="/app/dashboard">Login</Link>
            </Button>

            {/* Mobile Menu */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Menü öffnen</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72">
                <nav className="flex flex-col gap-4 mt-8">
                  {navigationItems.map(item => (
                    <NavLink
                      key={item.href}
                      to={item.href}
                      variant="ghost"
                      className="justify-start text-base"
                    >
                      {item.label}
                    </NavLink>
                  ))}

                  <div className="border-t pt-4 space-y-3">
                    <Button asChild className="w-full">
                      <Link to="/mitglied-werden" onClick={() => setIsMobileMenuOpen(false)}>
                        Mitglied werden
                      </Link>
                    </Button>
                    <Button asChild variant="outline" className="w-full">
                      <Link to="/app/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
                        Login
                      </Link>
                    </Button>
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </Container>
    </header>
  )
}

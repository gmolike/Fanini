import * as React from 'react'
import { Link } from '@tanstack/react-router'
import { Menu } from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger } from '@/shared/shadcn/sheet'
import { cn } from '@/shared/lib'
import type { HeaderProps } from '../model/types'
import { Button } from '@/shared/shadcn'

/**
 * Header Komponente
 * @description Responsive Header mit Logo und Navigation
 */
export const Header = ({ className, showMobileMenu = true }: HeaderProps) => {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <header className={cn('sticky top-0 z-50 w-full border-b bg-background', className)}>
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded bg-[#34687e]" />
          <span className="font-heading text-xl font-bold">Fanini</span>
        </Link>

        <nav className="hidden gap-6 md:flex">
          <Link to="/about" className="text-sm font-medium transition-colors hover:text-[#34687e]">
            Über uns
          </Link>
          <Link to="/events" className="text-sm font-medium transition-colors hover:text-[#34687e]">
            Events
          </Link>
          <Link to="/about" className="text-sm font-medium transition-colors hover:text-[#34687e]">
            Kontakt
          </Link>
        </nav>

        {showMobileMenu && (
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <nav className="flex flex-col gap-4">
                <Link to="/about" onClick={() => setIsOpen(false)} className="text-lg font-medium">
                  Über uns
                </Link>
                <Link to="/events" onClick={() => setIsOpen(false)} className="text-lg font-medium">
                  Events
                </Link>
                <Link to="/about" onClick={() => setIsOpen(false)} className="text-lg font-medium">
                  Kontakt
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        )}
      </div>
    </header>
  )
}

// frontend/src/widgets/Layout/Header.tsx
import { useState } from 'react';

import { Button, Sheet, SheetContent, SheetTrigger } from '@shared/shadcn';
import { Link } from '@tanstack/react-router';
import { Menu, Users } from 'lucide-react';

import { Container } from '@/shared/ui/layout/Container';
import { ThemeToggle } from '@/shared/ui/layout/ui/ThemeToggle';


export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Events', href: '/events' },
    { name: 'Über uns', href: '/about' },
    { name: 'Kontakt', href: '/kontakt' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-[var(--color-background)]/95 backdrop-blur supports-[backdrop-filter]:bg-[var(--color-background)]/80">
      <Container>
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img
              src="/images/logo.png"
              alt="Faninitiative Spandau e.V."
              className="h-10 w-10 object-contain"
            />
            <span className="hidden font-[Bebas_Neue] text-xl text-[var(--color-fanini-blue)] sm:block">
              Faninitiative Spandau
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-6 md:flex">
            {navigation.map(item => (
              <Link
                key={item.name}
                to={item.href}
                className="text-sm font-medium transition-colors hover:text-[var(--color-fanini-blue)]"
                activeProps={{
                  className: 'text-[var(--color-fanini-blue)]',
                }}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA + Theme Toggle */}
          <div className="hidden items-center gap-2 md:flex">
            <ThemeToggle />
            <Button variant="outline" asChild>
              <Link to="/app">
                <Users className="mr-2 h-4 w-4" />
                Mitgliederbereich
              </Link>
            </Button>
          </div>

          {/* Mobile: Theme Toggle + Menu */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Menü öffnen</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <nav className="mt-8 flex flex-col gap-4">
                  {navigation.map(item => (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => {
                        setIsOpen(false);
                      }}
                      className="text-lg font-medium transition-colors hover:text-[var(--color-fanini-blue)]"
                      activeProps={{
                        className: 'text-[var(--color-fanini-blue)]',
                      }}
                    >
                      {item.name}
                    </Link>
                  ))}
                  <hr className="my-4" />
                  <Button
                    asChild
                    className="w-full"
                    onClick={() => {
                      setIsOpen(false);
                    }}
                  >
                    <Link to="/app">
                      <Users className="mr-2 h-4 w-4" />
                      Mitgliederbereich
                    </Link>
                  </Button>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </Container>
    </header>
  );
};

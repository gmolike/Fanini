// widgets/shared/layout/Header.tsx - Mit Active States
import { useState } from 'react';

import { Link, useLocation } from '@tanstack/react-router';
import { ChevronDown, Menu, Users } from 'lucide-react';

import { cn } from '@/shared/lib';
import { Button, Sheet, SheetContent, SheetTrigger } from '@/shared/shadcn';
import { Container, ThemeToggle } from '@/shared/ui';

export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const currentPath = location.pathname;

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Events', href: '/events' },
    {
      name: 'Über uns',
      href: '/about',
      children: [
        { name: 'Vereinsstruktur', href: '/about' },
        { name: 'Satzung', href: '/satzung' },
        { name: 'Historie', href: '/historie' },
      ],
    },
    { name: 'News', href: '/newsletter' },
    {
      name: 'Kreativ',
      href: '/kreativ',
      children: [
        { name: 'Künstler', href: '/kreativ' },
        { name: 'Galerie', href: '/kreativ/galerie' },
      ],
    },
    { name: 'Kontakt', href: '/kontakt' },
  ];

  // Helper function to check if a route is active
  const isActive = (href: string) => {
    return currentPath === href;
  };

  // Helper function to check if any child is active
  const isParentActive = (item: (typeof navigation)[0]) => {
    if (isActive(item.href)) return true;
    if (item.children) {
      return item.children.some(child => isActive(child.href));
    }
    return false;
  };

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
              <div key={item.name} className="group relative">
                {item.children ? (
                  <>
                    <button
                      className={cn(
                        'flex items-center gap-1 py-2 text-sm font-medium transition-colors hover:text-[var(--color-fanini-blue)]',
                        isParentActive(item) && 'text-[var(--color-fanini-blue)]'
                      )}
                    >
                      {item.name}
                      <ChevronDown className="h-3.5 w-3.5 transition-transform duration-200 group-hover:rotate-180" />
                    </button>

                    {/* Dropdown mit Padding-Wrapper */}
                    <div className="absolute top-full left-0 hidden pt-2 group-hover:block">
                      {/* Unsichtbare Brücke */}
                      <div className="absolute -top-2 right-0 left-0 h-2" />

                      {/* Dropdown Menu */}
                      <div className="min-w-[200px] rounded-md border bg-[var(--color-background)] py-1 shadow-lg">
                        {item.children.map(child => (
                          <Link
                            key={child.href}
                            to={child.href}
                            className={cn(
                              'block px-4 py-2 text-sm transition-colors hover:bg-[var(--color-muted)] hover:text-[var(--color-fanini-blue)]',
                              isActive(child.href) &&
                                'bg-[var(--color-muted)] font-medium text-[var(--color-fanini-blue)]'
                            )}
                          >
                            {child.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <Link
                    to={item.href}
                    className={cn(
                      'text-sm font-medium transition-colors hover:text-[var(--color-fanini-blue)]',
                      isActive(item.href) && 'text-[var(--color-fanini-blue)]'
                    )}
                  >
                    {item.name}
                  </Link>
                )}
              </div>
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

          {/* Mobile Menu */}
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
                    <div key={item.name}>
                      {item.children ? (
                        <>
                          <div
                            className={cn(
                              'mb-2 text-lg font-semibold',
                              isParentActive(item) && 'text-[var(--color-fanini-blue)]'
                            )}
                          >
                            {item.name}
                          </div>
                          <div className="ml-4 space-y-2">
                            {item.children.map(child => (
                              <Link
                                key={child.href}
                                to={child.href}
                                onClick={() => { setIsOpen(false); }}
                                className={cn(
                                  'block text-base transition-colors hover:text-[var(--color-fanini-blue)]',
                                  isActive(child.href) &&
                                    'font-medium text-[var(--color-fanini-blue)]'
                                )}
                              >
                                {child.name}
                              </Link>
                            ))}
                          </div>
                        </>
                      ) : (
                        <Link
                          to={item.href}
                          onClick={() => { setIsOpen(false); }}
                          className={cn(
                            'text-lg font-medium transition-colors hover:text-[var(--color-fanini-blue)]',
                            isActive(item.href) && 'text-[var(--color-fanini-blue)]'
                          )}
                        >
                          {item.name}
                        </Link>
                      )}
                    </div>
                  ))}
                  <hr className="my-4" />
                  <Button asChild className="w-full" onClick={() => { setIsOpen(false); }}>
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

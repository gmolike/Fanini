// frontend/src/widgets/shared/layout/Header.tsx (NUR Dropdown korrigiert)
import { useEffect, useState } from 'react';

import { Link, useLocation } from '@tanstack/react-router';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, Menu, Users, X } from 'lucide-react';

import { cn } from '@/shared/lib';
import { Button, Sheet, SheetContent, SheetTrigger } from '@/shared/shadcn';
import { ThemeToggle } from '@/shared/ui';

export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const currentPath = location.pathname;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Events', href: '/events' },
    {
      name: 'Über uns',
      href: '/about',
      children: [
        { name: 'Gremien', href: '/about' },
        { name: 'Satzung', href: '/satzung' },
        { name: 'Historie', href: '/historie' },
      ],
    },
    { name: 'News', href: '/newsletter' },
    {
      name: 'Dokumente',
      href: '/dokumente',
      children: [
        { name: 'Alle Dokumente', href: '/dokumente' },
        { name: 'Vereinsstruktur', href: '/dokumente/struktur' },
        { name: 'FAQ & Guides', href: '/dokumente/faq' },
      ],
    },
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

  const isActive = (href: string) => {
    return currentPath === href;
  };

  const isParentActive = (item: (typeof navigation)[0]) => {
    if (isActive(item.href)) return true;
    if (item.children) {
      return item.children.some(child => isActive(child.href));
    }
    return false;
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', damping: 30 }}
      className={cn(
        'sticky top-0 z-50 w-full transition-all duration-300',
        scrolled ? 'bg-background/80 border-border/50 border-b backdrop-blur-xl' : 'bg-transparent'
      )}
    >
      <div className="w-full px-4 md:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link to="/" className="flex items-center gap-2">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[var(--color-fanini-blue)] to-[var(--color-fanini-red)] opacity-50 blur-md" />
                <img
                  src="/images/logo.png"
                  alt="Faninitiative Spandau e.V."
                  className="relative h-10 w-10 object-contain"
                />
              </div>
              <span className="hidden bg-gradient-to-r from-[var(--color-fanini-blue)] to-[var(--color-fanini-red)] bg-clip-text font-[Bebas_Neue] text-xl text-transparent sm:block">
                Faninitiative Spandau
              </span>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-1 md:flex">
            {navigation.map(item => (
              <div key={item.name} className="group relative">
                {item.children ? (
                  <>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={cn(
                        'flex items-center gap-1 rounded-lg px-4 py-2 text-sm font-medium transition-all',
                        // eslint-disable-next-line sonarjs/no-duplicate-string
                        'hover:bg-gradient-to-r hover:from-[var(--color-fanini-blue)]/10 hover:to-[var(--color-fanini-red)]/10',
                        isParentActive(item) &&
                          'bg-gradient-to-r from-[var(--color-fanini-blue)]/10 to-[var(--color-fanini-red)]/10 text-[var(--color-fanini-blue)]'
                      )}
                    >
                      {item.name}
                      <ChevronDown className="h-3.5 w-3.5 transition-transform duration-200 group-hover:rotate-180" />
                    </motion.button>

                    {/* Dropdown - MIT VOLLEM KONTRAST */}
                    <AnimatePresence>
                      <div className="absolute top-full left-0 hidden pt-2 group-hover:block">
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                          className="border-border bg-background min-w-[220px] rounded-lg border shadow-xl"
                        >
                          <div className="p-2">
                            {item.children.map(child => (
                              <Link
                                key={child.href}
                                to={child.href}
                                className={cn(
                                  'block rounded-md px-4 py-2 text-sm transition-all',
                                  'hover:bg-gradient-to-r hover:from-[var(--color-fanini-blue)]/10 hover:to-[var(--color-fanini-red)]/10',
                                  isActive(child.href) &&
                                    'bg-gradient-to-r from-[var(--color-fanini-blue)]/10 to-[var(--color-fanini-red)]/10 font-medium text-[var(--color-fanini-blue)]'
                                )}
                              >
                                {child.name}
                              </Link>
                            ))}
                          </div>
                        </motion.div>
                      </div>
                    </AnimatePresence>
                  </>
                ) : (
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link
                      to={item.href}
                      className={cn(
                        'rounded-lg px-4 py-2 text-sm font-medium transition-all',
                        'hover:bg-gradient-to-r hover:from-[var(--color-fanini-blue)]/10 hover:to-[var(--color-fanini-red)]/10',
                        isActive(item.href) &&
                          'bg-gradient-to-r from-[var(--color-fanini-blue)]/10 to-[var(--color-fanini-red)]/10 text-[var(--color-fanini-blue)]'
                      )}
                    >
                      {item.name}
                    </Link>
                  </motion.div>
                )}
              </div>
            ))}
          </nav>

          {/* Desktop CTA + Theme Toggle */}
          <div className="hidden items-center gap-3 md:flex">
            <ThemeToggle />
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                className="border-0 bg-gradient-to-r from-[var(--color-fanini-blue)] to-[var(--color-fanini-red)] text-white hover:opacity-90"
                asChild
              >
                <Link to="/app">
                  <Users className="mr-2 h-4 w-4" />
                  Mitgliederbereich
                </Link>
              </Button>
            </motion.div>
          </div>

          {/* Mobile Menu bleibt gleich */}
          <div className="flex items-center gap-3 md:hidden">
            <ThemeToggle />
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Button variant="ghost" size="icon" className="relative">
                    <AnimatePresence mode="wait">
                      {isOpen ? (
                        <motion.div
                          key="close"
                          initial={{ rotate: -90, opacity: 0 }}
                          animate={{ rotate: 0, opacity: 1 }}
                          exit={{ rotate: 90, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <X className="h-5 w-5" />
                        </motion.div>
                      ) : (
                        <motion.div
                          key="menu"
                          initial={{ rotate: 90, opacity: 0 }}
                          animate={{ rotate: 0, opacity: 1 }}
                          exit={{ rotate: -90, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Menu className="h-5 w-5" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                    <span className="sr-only">Menü öffnen</span>
                  </Button>
                </motion.button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="bg-background/95 w-[300px] backdrop-blur-xl sm:w-[400px]"
              >
                <nav className="mt-8 flex flex-col gap-2">
                  {navigation.map((item, index) => (
                    <motion.div
                      key={item.name}
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      {item.children ? (
                        <>
                          <div
                            className={cn(
                              'mb-2 bg-gradient-to-r bg-clip-text text-lg font-semibold text-transparent',
                              isParentActive(item)
                                ? 'from-[var(--color-fanini-blue)] to-[var(--color-fanini-red)]'
                                : 'from-foreground to-foreground'
                            )}
                          >
                            {item.name}
                          </div>
                          <div className="ml-4 space-y-1">
                            {item.children.map(child => (
                              <Link
                                key={child.href}
                                to={child.href}
                                onClick={() => {
                                  setIsOpen(false);
                                }}
                                className={cn(
                                  'block rounded-md px-3 py-2 text-base transition-all',
                                  'hover:bg-gradient-to-r hover:from-[var(--color-fanini-blue)]/10 hover:to-[var(--color-fanini-red)]/10',
                                  isActive(child.href) &&
                                    'bg-gradient-to-r from-[var(--color-fanini-blue)]/10 to-[var(--color-fanini-red)]/10 font-medium text-[var(--color-fanini-blue)]'
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
                          onClick={() => {
                            setIsOpen(false);
                          }}
                          className={cn(
                            'rounded-md px-3 py-2 text-lg font-medium transition-all',
                            'hover:bg-gradient-to-r hover:from-[var(--color-fanini-blue)]/10 hover:to-[var(--color-fanini-red)]/10',
                            isActive(item.href) &&
                              'bg-gradient-to-r from-[var(--color-fanini-blue)]/10 to-[var(--color-fanini-red)]/10 text-[var(--color-fanini-blue)]'
                          )}
                        >
                          {item.name}
                        </Link>
                      )}
                    </motion.div>
                  ))}
                  <hr className="border-border/50 my-4" />
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: navigation.length * 0.05 }}
                  >
                    <Button
                      asChild
                      className="w-full border-0 bg-gradient-to-r from-[var(--color-fanini-blue)] to-[var(--color-fanini-red)] text-white hover:opacity-90"
                      onClick={() => {
                        setIsOpen(false);
                      }}
                    >
                      <Link to="/app">
                        <Users className="mr-2 h-4 w-4" />
                        Mitgliederbereich
                      </Link>
                    </Button>
                  </motion.div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

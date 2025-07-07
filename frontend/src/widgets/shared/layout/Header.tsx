// frontend/src/widgets/shared/layout/Header.tsx
import { useEffect, useState } from 'react';

import { useLocation } from '@tanstack/react-router';
import { motion } from 'framer-motion';

import {
  DesktopNavigation,
  HeaderLogo,
  MemberAreaButton,
  MobileMenuTrigger,
  MobileNavigation,
} from '@/features/public/navigation';

import { navigationItems } from '@/shared/config/navigation';
import { cn } from '@/shared/lib';
import { Sheet, SheetContent, SheetTrigger } from '@/shared/shadcn';
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

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', damping: 30 }}
      className={cn(
        'sticky top-0 z-50 w-full transition-all duration-300',
        scrolled
          ? 'bg-background/98 dark:bg-background/95 border-border border-b shadow-sm backdrop-blur-2xl'
          : 'bg-background/95 dark:bg-background/90 backdrop-blur-xl'
      )}
    >
      <div className="w-full px-4 md:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <HeaderLogo />

          {/* Desktop Navigation */}
          <DesktopNavigation items={navigationItems} currentPath={currentPath} />

          {/* Desktop CTA + Theme Toggle */}
          <div className="hidden items-center gap-3 md:flex">
            <ThemeToggle />
            <MemberAreaButton />
          </div>

          {/* Mobile Menu - FIXED Button-in-Button issue */}
          <div className="flex items-center gap-3 md:hidden">
            <ThemeToggle />
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger className="hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring inline-flex h-9 w-9 items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:ring-1 focus-visible:outline-none">
                <MobileMenuTrigger isOpen={isOpen} />
              </SheetTrigger>
              <SheetContent
                side="right"
                className="bg-background/98 w-[300px] backdrop-blur-2xl sm:w-[400px]"
              >
                <MobileNavigation
                  items={navigationItems}
                  currentPath={currentPath}
                  onItemClick={() => {
                    setIsOpen(false);
                  }}
                />
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

// frontend/src/features/navigation/desktop-navigation/DesktopNavigation.tsx
import { Link } from '@tanstack/react-router';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

import type { NavigationItem } from '@/shared/config';
import { cn } from '@/shared/lib';

type DesktopNavigationProps = {
  items: NavigationItem[];
  currentPath: string;
};

export const DesktopNavigation = ({ items, currentPath }: DesktopNavigationProps) => {
  const isActive = (href: string) => currentPath === href;

  const isParentActive = (item: NavigationItem) => {
    if (isActive(item.href)) return true;
    if (item.children) {
      return item.children.some(child => isActive(child.href));
    }
    return false;
  };

  return (
    <nav className="hidden items-center gap-1 md:flex">
      {items.map(item => (
        <div key={item.name} className="group relative">
          {item.children ? (
            <>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={cn(
                  'flex items-center gap-1 rounded-lg px-4 py-2 text-sm font-medium transition-all',
                  'hover:bg-gradient-to-r hover:from-[var(--color-fanini-blue)]/10 hover:to-[var(--color-fanini-red)]/10',
                  isParentActive(item) &&
                    'bg-gradient-to-r from-[var(--color-fanini-blue)]/10 to-[var(--color-fanini-red)]/10 text-[var(--color-fanini-blue)]'
                )}
              >
                {item.name}
                <ChevronDown className="h-3.5 w-3.5 transition-transform duration-200 group-hover:rotate-180" />
              </motion.button>

              {/* Dropdown */}
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
  );
};

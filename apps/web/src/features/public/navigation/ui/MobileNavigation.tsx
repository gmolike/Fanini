// frontend/src/features/navigation/mobile-navigation/MobileNavigation.tsx
import { Link } from '@tanstack/react-router';
import { motion } from 'framer-motion';
import { Users } from 'lucide-react';

import type { NavigationItem } from '@/shared/config';
import { cn } from '@/shared/lib';
import { Button } from '@/shared/shadcn';

type MobileNavigationProps = {
  items: NavigationItem[];
  currentPath: string;
  onItemClick: () => void;
};

export const MobileNavigation = ({ items, currentPath, onItemClick }: MobileNavigationProps) => {
  const isActive = (href: string) => currentPath === href;

  const isParentActive = (item: NavigationItem) => {
    if (isActive(item.href)) return true;
    if (item.children) {
      return item.children.some(child => isActive(child.href));
    }
    return false;
  };

  return (
    <nav className="mt-8 flex flex-col gap-2">
      {items.map((item, index) => (
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
                    onClick={onItemClick}
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
              onClick={onItemClick}
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
        transition={{ delay: items.length * 0.05 }}
      >
        <Button
          asChild
          className="w-full border-0 bg-gradient-to-r from-[var(--color-fanini-blue)] to-[var(--color-fanini-red)] text-white hover:opacity-90"
          onClick={onItemClick}
        >
          <Link to="/app">
            <Users className="mr-2 h-4 w-4" />
            Mitgliederbereich
          </Link>
        </Button>
      </motion.div>
    </nav>
  );
};

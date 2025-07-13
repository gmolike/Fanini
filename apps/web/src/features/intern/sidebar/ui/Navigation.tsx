// features/sidebar/ui/Navigation.tsx
import { Link, useRouterState } from '@tanstack/react-router';

import { cn } from '@/shared/lib';
import { Badge } from '@/shared/shadcn/badge';
import { ScrollArea } from '@/shared/shadcn/scroll-area';

import { navigationItems } from '../model/config';

import type { AuthUser } from '../model/types';

type NavigationProps = {
  user: AuthUser;
  onNavigate?: () => void;
};

/**
 * Navigation menu for the sidebar
 * @param user - Current user for role-based filtering
 * @param onNavigate - Callback when navigation item is clicked
 * @returns Scrollable navigation menu
 */
export const Navigation = ({ user, onNavigate }: NavigationProps) => {
  const router = useRouterState();

  const filteredItems = navigationItems.filter(item => {
    if (!item.requiredRole) return true;
    return item.requiredRole.includes(user.roleType);
  });

  return (
    <ScrollArea className="flex-1">
      <nav className="space-y-1 p-4">
        {filteredItems.map(item => {
          const Icon = item.icon;
          const isActive =
            router.location.pathname === item.href ||
            (item.href !== '/intern' && router.location.pathname.startsWith(item.href));

          return (
            <Link
              key={item.name}
              to={item.href}
              onClick={onNavigate}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-[var(--color-accent)] text-[var(--color-accent-foreground)]'
                  : 'hover:bg-[var(--color-accent)] hover:text-[var(--color-accent-foreground)]'
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="flex-1">{item.name}</span>
              {item.badge ? (
                <Badge variant="secondary" className="ml-auto h-5 px-1.5 text-xs">
                  {item.badge}
                </Badge>
              ) : null}
            </Link>
          );
        })}
      </nav>
    </ScrollArea>
  );
};

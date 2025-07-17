// features/intern/sidebar/ui/Sidebar.tsx
import { Link, useRouterState } from '@tanstack/react-router';
import { LogOut } from 'lucide-react';

import { cn } from '@/shared/lib';
import { Badge } from '@/shared/shadcn/badge';
import { Button } from '@/shared/shadcn/button';
import { ScrollArea } from '@/shared/shadcn/scroll-area';
import { Separator } from '@/shared/shadcn/separator';

import { navigationItems, roleColors } from '../model/config';

import type { AuthUser, NavItem, SidebarProps } from '../model/types';

/**
 * Logo component for the sidebar
 * @returns Logo with Faninitiative branding
 */
const Logo = () => {
  return (
    <div className="flex h-16 items-center border-b px-6">
      <Link to="/" className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-[var(--color-fanini-blue)] to-[var(--color-fanini-red)] font-bold text-white">
          <img
            src="/images/logo.png"
            alt="Faninitiative Spandau e.V."
            className="relative h-10 w-10 object-contain"
          />
        </div>
        <span className="font-[Bebas_Neue] text-xl">Faninitiative</span>
      </Link>
    </div>
  );
};

/**
 * Displays user information in the sidebar
 * @param user - The authenticated user object
 * @returns User info section with avatar and role badge
 */
const UserInfo = ({ user }: { user: AuthUser }) => {
  const initials = user.name;
  return (
    <div className="border-b p-4">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[var(--color-fanini-blue)] to-[var(--color-fanini-red)] font-semibold text-white">
          {initials}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">{user.name}</p>
          <Badge variant="outline" className={cn(roleColors[user.roleType], 'text-xs')}>
            {user.role}
          </Badge>
        </div>
      </div>
    </div>
  );
};

/**
 * Navigation menu for the sidebar
 * @param user - Current user for role-based filtering
 * @param onNavigate - Callback when navigation item is clicked
 * @returns Scrollable navigation menu
 */
const Navigation = ({ user, onNavigate }: { user: AuthUser; onNavigate?: () => void }) => {
  const router = useRouterState();

  const filteredItems = navigationItems.filter(item => {
    if (!item.requiredRole) return true;
    return item.requiredRole.includes(user.roleType);
  });

  // Gruppiere Items
  const mainItems = filteredItems.filter(item => !item.href.includes('/dev'));
  const devItems = filteredItems.filter(item => item.href.includes('/dev'));

  const renderNavItem = (item: NavItem) => {
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
  };

  return (
    <ScrollArea className="flex-1">
      <nav className="space-y-1 p-4">
        {/* Main Navigation */}
        <div className="space-y-1">{mainItems.map(renderNavItem)}</div>

        {/* Dev Section - nur wenn Dev-Items vorhanden */}
        {devItems.length > 0 && (
          <>
            <Separator className="my-4" />
            <div className="space-y-1">
              <div className="mb-2 px-3">
                <h3 className="text-xs font-semibold tracking-wider text-[var(--color-muted-foreground)] uppercase">
                  Development
                </h3>
              </div>
              {devItems.map(renderNavItem)}
            </div>
          </>
        )}
      </nav>
    </ScrollArea>
  );
};

/**
 * Logout button for the sidebar
 * @param onLogout - Callback when logout is clicked
 * @returns Styled logout button
 */
const LogoutButton = ({ onLogout }: { onLogout: () => void }) => {
  return (
    <div className="border-t p-4">
      <Button
        onClick={onLogout}
        variant="ghost"
        className="w-full justify-start text-[var(--color-destructive)] hover:bg-[var(--color-destructive)]/10 hover:text-[var(--color-destructive)]"
      >
        <LogOut className="mr-3 h-5 w-5" />
        Abmelden
      </Button>
    </div>
  );
};

/**
 * Complete sidebar component for internal area
 * @param user - Authenticated user
 * @param onLogout - Logout handler
 * @param onOpenChange - Optional callback for mobile sidebar state
 * @returns Sidebar with navigation and user info
 */
export const Sidebar = ({ user, onLogout, onOpenChange }: SidebarProps) => {
  const handleNavigate = () => {
    onOpenChange?.(false);
  };

  return (
    <div className="flex h-full flex-col bg-[var(--color-card)]">
      <Logo />
      <UserInfo user={user} />
      <Navigation user={user} onNavigate={handleNavigate} />
      <LogoutButton onLogout={onLogout} />
    </div>
  );
};

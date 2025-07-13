/* eslint-disable @typescript-eslint/naming-convention */
// apps/web/src/pages/_intern.tsx
import { useEffect, useState } from 'react';

import { createFileRoute, Link, Outlet, useNavigate, useRouterState } from '@tanstack/react-router';
import { Bell, LogOut, Menu, Settings, Users } from 'lucide-react';

import { type AuthUser, Sidebar } from '@/features/intern/sidebar';

import { Button } from '@/shared/shadcn/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/shadcn/dropdown-menu';
import { Sheet, SheetContent } from '@/shared/shadcn/sheet';
import { ThemeToggle } from '@/shared/ui';

export const Route = createFileRoute('/intern')({
  component: InternLayout,
});

const getPageTitle = (pathname: string): string => {
  const titles: Record<string, string> = {
    '/intern': 'Dashboard',
    '/intern/events': 'Events',
    '/intern/tasks': 'Aufgaben',
    '/intern/teams': 'Teams',
    '/intern/members': 'Mitglieder',
    '/intern/gallery': 'Galerie',
    '/intern/creator': 'Creator',
    '/intern/club': 'Verein',
    '/intern/settings': 'Einstellungen',
    '/intern/notifications': 'Benachrichtigungen',
    '/intern/profile': 'Mein Profil',
    '/intern/dev': 'Developer Dashboard',
    '/intern/dev/storybook': 'Storybook',
    '/intern/dev/features': 'Feature Requests',
    '/intern/dev/roadmap': 'Roadmap',
  };

  // Exact match first
  if (titles[pathname]) return titles[pathname];

  // Then check for prefix matches
  const matchingKey = Object.keys(titles).find(
    key => key !== '/intern' && pathname.startsWith(key)
  );

  return matchingKey ? (titles[matchingKey] ?? 'Mitgliederbereich') : 'Mitgliederbereich';
};

function InternLayout() {
  const navigate = useNavigate();
  const router = useRouterState();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [notificationCount] = useState(3);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Check auth on mount
  useEffect(() => {
    const authData = localStorage.getItem('fanini-auth');
    if (!authData) {
      void navigate({ to: '/login' });
      return;
    }

    try {
      const parsed = JSON.parse(authData) as { expiresAt: string; user: AuthUser };
      if (new Date(parsed.expiresAt) < new Date()) {
        localStorage.removeItem('fanini-auth');
        void navigate({ to: '/login' });
        return;
      }
      setUser(parsed.user);
    } catch {
      void navigate({ to: '/login' });
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('fanini-auth');
    void navigate({ to: '/login' });
  };

  // Don't render layout on login page
  if (router.location.pathname === '/login') {
    return <Outlet />;
  }

  if (!user) {
    return null; // Loading state
  }

  const userInitials = user.name
    .split(' ')
    .map(n => n[0])
    .join('');

  const currentPageTitle = getPageTitle(router.location.pathname);

  return (
    <div className="flex min-h-screen bg-[var(--color-background)]">
      {/* Desktop Sidebar */}
      <aside className="hidden w-64 flex-col border-r bg-[var(--color-card)] md:flex">
        <Sidebar user={user} onLogout={handleLogout} />
      </aside>

      {/* Mobile Sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="w-64 p-0">
          <Sidebar user={user} onLogout={handleLogout} onOpenChange={setSidebarOpen} />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b bg-[var(--color-card)] px-4 md:px-6">
          <div className="flex items-center gap-4">
            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => {
                setSidebarOpen(true);
              }}
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle sidebar</span>
            </Button>

            {/* Page Title */}
            <h1 className="text-xl font-semibold">{currentPageTitle}</h1>
          </div>

          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Notifications */}
            <Link to="/intern/notifications" className="relative">
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
                {notificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--color-fanini-red)] text-xs text-white">
                    {notificationCount}
                  </span>
                )}
                <span className="sr-only">Benachrichtigungen</span>
              </Button>
            </Link>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[var(--color-fanini-blue)] to-[var(--color-fanini-red)] text-sm font-semibold text-white">
                    {userInitials}
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-muted-foreground text-xs">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/intern/profile">
                    <Users className="mr-2 h-4 w-4" />
                    Mein Profil
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/intern/settings">
                    <Settings className="mr-2 h-4 w-4" />
                    Einstellungen
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-[var(--color-destructive)]"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Abmelden
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

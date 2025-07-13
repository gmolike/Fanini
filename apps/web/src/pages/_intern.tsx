// apps/web/src/pages/intern/_layout.tsx
import { useEffect, useState } from 'react';

import { createFileRoute, Link, Outlet, useNavigate, useRouterState } from '@tanstack/react-router';
import {
  Bell,
  Calendar,
  Camera,
  CheckSquare,
  Crown,
  Home,
  LogOut,
  Menu,
  PlusCircle,
  Settings,
  Shield,
  Users,
} from 'lucide-react';

import { cn } from '@/shared/lib';
import { Badge } from '@/shared/shadcn/badge';
import { Button } from '@/shared/shadcn/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/shadcn/dropdown-menu';
import { ScrollArea } from '@/shared/shadcn/scroll-area';
import { Sheet, SheetContent } from '@/shared/shadcn/sheet';
import { ThemeToggle } from '@/shared/ui';

export const Route = createFileRoute('/_intern')({
  component: InternLayout,
});

type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  roleType: 'admin' | 'vorstand' | 'beirat' | 'team' | 'member';
  teams?: string[];
};

type NavItem = {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
  requiredRole?: string[];
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
      const parsed = JSON.parse(authData);
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

  // Navigation items with role-based visibility
  const navigation: NavItem[] = [
    { name: 'Dashboard', href: '/intern', icon: Home },
    { name: 'Events', href: '/intern/events', icon: Calendar },
    { name: 'Aufgaben', href: '/intern/tasks', icon: CheckSquare, badge: 5 },
    { name: 'Teams', href: '/intern/teams', icon: Shield },
    { name: 'Mitglieder', href: '/intern/members', icon: Users },
    { name: 'Galerie', href: '/intern/gallery', icon: Camera },
    {
      name: 'Creator',
      href: '/intern/creator',
      icon: PlusCircle,
      requiredRole: ['admin', 'vorstand', 'beirat'],
    },
    { name: 'Verein', href: '/intern/club', icon: Crown },
    {
      name: 'Einstellungen',
      href: '/intern/settings',
      icon: Settings,
      requiredRole: ['admin', 'vorstand'],
    },
  ];

  // Filter navigation based on user role
  const filteredNav = navigation.filter(item => {
    if (!item.requiredRole) return true;
    return item.requiredRole.includes(user?.roleType ?? '');
  });

  // Don't render layout on login page
  if (router.location.pathname === '/login') {
    return <Outlet />;
  }

  if (!user) {
    return null; // Loading state
  }

  const roleColors = {
    admin: 'bg-purple-100 text-purple-700 border-purple-200',
    vorstand: 'bg-amber-100 text-amber-700 border-amber-200',
    beirat: 'bg-blue-100 text-blue-700 border-blue-200',
    team: 'bg-green-100 text-green-700 border-green-200',
    member: 'bg-gray-100 text-gray-700 border-gray-200',
  };

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="flex h-16 items-center border-b px-6">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-[var(--color-fanini-blue)] to-[var(--color-fanini-red)] font-bold text-white">
            F
          </div>
          <span className="font-[Bebas_Neue] text-xl">Faninitiative</span>
        </Link>
      </div>

      {/* User Info */}
      <div className="border-b p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[var(--color-fanini-blue)] to-[var(--color-fanini-red)] font-semibold text-white">
            {user.name
              .split(' ')
              .map(n => n[0])
              .join('')}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{user.name}</p>
            <Badge variant="outline" className={cn(roleColors[user.roleType], 'text-xs')}>
              {user.role}
            </Badge>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1">
        <nav className="space-y-1 p-4">
          {filteredNav.map(item => {
            const Icon = item.icon;
            const isActive =
              router.location.pathname === item.href ||
              (item.href !== '/intern' && router.location.pathname.startsWith(item.href));

            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => {
                  setSidebarOpen(false);
                }}
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

      {/* Bottom section */}
      <div className="border-t p-4">
        <Button
          onClick={handleLogout}
          variant="ghost"
          className="w-full justify-start text-[var(--color-destructive)] hover:bg-[var(--color-destructive)]/10 hover:text-[var(--color-destructive)]"
        >
          <LogOut className="mr-3 h-5 w-5" />
          Abmelden
        </Button>
      </div>
    </>
  );

  return (
    <div className="flex min-h-screen bg-[var(--color-background)]">
      {/* Desktop Sidebar */}
      <aside className="hidden w-64 flex-col border-r bg-[var(--color-card)] md:flex">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="w-64 p-0">
          <SidebarContent />
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
            <h1 className="text-xl font-semibold">
              {filteredNav.find(item => {
                if (router.location.pathname === '/intern') return item.href === '/intern';
                return item.href !== '/intern' && router.location.pathname.startsWith(item.href);
              })?.name ?? 'Mitgliederbereich'}
            </h1>
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
                    {user.name
                      .split(' ')
                      .map(n => n[0])
                      .join('')}
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

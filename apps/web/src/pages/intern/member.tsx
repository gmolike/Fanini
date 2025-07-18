// apps/web/src/pages/intern/member.tsx
import { createFileRoute, Link, Outlet, useLocation } from '@tanstack/react-router';
import { LayoutDashboard, UserPlus, Users } from 'lucide-react';

import { MemberBreadcrumb } from '@/features/intern/member';

import { Button, Container } from '@/shared/ui';

export const Route = createFileRoute('/intern/member')({
  component: MemberLayout,
});

function MemberLayout() {
  const location = useLocation();
  const { pathname } = location;

  // Aktiven Tab bestimmen
  const getActiveTab = () => {
    if (
      pathname.includes('/member/list') ||
      pathname.includes('/member/detail') ||
      pathname.includes('/member/create') ||
      pathname.includes('/member/edit')
    )
      return 'list';
    if (pathname.includes('/member/dashboard')) return 'dashboard';
    return 'list';
  };

  const activeTab = getActiveTab();

  // Zeige Quick Actions nur auf der List-Seite
  const showQuickActions = pathname === '/intern/member/list';

  return (
    <Container className="py-6">
      {/* Breadcrumb */}
      <div className="mb-4">
        <MemberBreadcrumb />
      </div>

      {/* Header mit Navigation */}
      <div className="mb-6 border-b">
        <div className="flex items-center justify-between pb-4">
          <h1 className="text-2xl font-bold">Mitgliederverwaltung</h1>

          {/* Quick Actions */}
          {showQuickActions ? (
            <Link to="/intern/member/create">
              <Button size="sm">
                <UserPlus className="mr-2 h-4 w-4" />
                Neues Mitglied
              </Button>
            </Link>
          ) : null}
        </div>

        {/* Tab Navigation */}
        <nav className="flex space-x-8" aria-label="Tabs">
          <Link
            to="/intern/member/list"
            className={`border-b-2 px-1 pb-4 text-sm font-medium transition-colors ${
              activeTab === 'list'
                ? 'border-primary text-primary'
                : 'text-muted-foreground hover:text-foreground border-transparent'
            }`}
          >
            <Users className="mr-2 inline h-4 w-4" />
            Mitgliederliste
          </Link>
          <Link
            to="/intern/member/dashboard"
            className={`border-b-2 px-1 pb-4 text-sm font-medium transition-colors ${
              activeTab === 'dashboard'
                ? 'border-primary text-primary'
                : 'text-muted-foreground hover:text-foreground border-transparent'
            }`}
          >
            <LayoutDashboard className="mr-2 inline h-4 w-4" />
            Dashboard
          </Link>
        </nav>
      </div>

      {/* Content Outlet */}
      <Outlet />
    </Container>
  );
}

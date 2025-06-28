// frontend/src/pages/~app.tsx
import { createFileRoute, Outlet, Link } from '@tanstack/react-router';
import { LayoutDashboard, Calendar, Users, Activity, LogOut } from 'lucide-react';

export const Route = createFileRoute('/app')({
  component: AppLayout,
});

function AppLayout() {
  const navigation = [
    { name: 'Dashboard', href: '/app', icon: LayoutDashboard },
    { name: 'Events', href: '/app/events', icon: Calendar },
    { name: 'Mitglieder', href: '/app/members', icon: Users },
    { name: 'Aktivitäten', href: '/app/activities', icon: Activity },
  ];

  return (
    <div className='flex min-h-screen bg-[var(--color-background)]'>
      {/* Sidebar */}
      <aside className='w-64 border-r bg-[var(--color-card)]'>
        {/* Logo */}
        <div className='flex h-16 items-center border-b px-6'>
          <Link to='/' className='flex items-center gap-2'>
            <div
              className='flex h-8 w-8 items-center justify-center rounded-full font-bold text-white'
              style={{ backgroundColor: 'var(--color-fanini-blue)' }}
            >
              F
            </div>
            <span className='font-[Bebas_Neue] text-xl'>Faninitiative</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className='flex-1 space-y-1 p-4'>
          {navigation.map(item => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.href}
                className='flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-[var(--color-accent)] hover:text-[var(--color-accent-foreground)] [&.active]:bg-[var(--color-accent)] [&.active]:text-[var(--color-accent-foreground)]'
                activeProps={{ className: 'active' }}
              >
                <Icon className='h-5 w-5' />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Bottom section */}
        <div className='border-t p-4'>
          <button className='flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-[var(--color-destructive)] transition-colors hover:bg-[var(--color-accent)]'>
            <LogOut className='h-5 w-5' />
            Abmelden
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className='flex flex-1 flex-col'>
        {/* Header */}
        <header className='flex h-16 items-center justify-between border-b bg-[var(--color-card)] px-6'>
          <h1 className='text-xl font-semibold'>Mitgliederbereich</h1>
          <div className='flex items-center gap-4'>
            <span className='text-sm text-[var(--color-muted-foreground)]'>Hallo, Max!</span>
            <div
              className='flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold text-white'
              style={{ backgroundColor: 'var(--color-fanini-blue)' }}
            >
              MM
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className='flex-1 p-6'>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

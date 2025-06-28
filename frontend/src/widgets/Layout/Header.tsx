// src/widgets/Layout/Header.tsx
import { Link } from '@tanstack/react-router';
import { Bell, User, Menu } from 'lucide-react';
import { Button } from '@/shared/shadcn/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/shadcn/dropdown-menu';
import { Container } from '@/shared/ui/layout/Container';
import { Sheet, SheetContent, SheetTrigger } from '@/shared/shadcn/sheet';

export const Header = () => {
  const isPublic = !window.location.pathname.startsWith('/app');

  return (
    <header
      className={`h-20 ${isPublic ? 'bg-white/95 backdrop-blur-sm' : 'bg-card'} sticky top-0 z-50 border-b shadow-sm`}
    >
      <Container className='h-full'>
        <div className='flex h-full items-center justify-between'>
          {/* Logo */}
          <Link to='/' className='group flex items-center gap-3'>
            <div className='relative'>
              <div className='from-fanini-blue-500 to-fanini-blue-600 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br shadow-lg transition-shadow group-hover:shadow-xl'>
                <span className='text-xl font-bold text-white'>F</span>
              </div>
              <div className='bg-fanini-red-500 absolute -right-1 -bottom-1 h-4 w-4 rounded-full border-2 border-white' />
            </div>
            <div className='hidden sm:block'>
              <div className='font-heading from-fanini-blue-600 to-fanini-blue-700 bg-gradient-to-r bg-clip-text text-2xl font-bold text-transparent'>
                Faninitiative
              </div>
              <div className='text-muted-foreground -mt-1 text-xs'>Spandau e.V. seit 2022</div>
            </div>
          </Link>

          {/* Desktop Navigation for Public Pages */}
          {isPublic && (
            <nav className='hidden items-center gap-6 lg:flex'>
              <Link
                to='/'
                className='text-foreground hover:text-fanini-blue-600 font-medium transition-colors'
              >
                Home
              </Link>
              <Link
                to='/app/events'
                className='text-foreground hover:text-fanini-blue-600 font-medium transition-colors'
              >
                Events
              </Link>
              <Link
                to='/kontakt'
                className='text-foreground hover:text-fanini-blue-600 font-medium transition-colors'
              >
                Kontakt
              </Link>
              <Link
                to='/impressum'
                className='text-foreground hover:text-fanini-blue-600 font-medium transition-colors'
              >
                Über uns
              </Link>
            </nav>
          )}

          {/* User Actions */}
          <div className='flex items-center gap-3'>
            {isPublic ? (
              <>
                <Button variant='outline' asChild className='hidden sm:inline-flex'>
                  <Link to='/app'>Mitgliederbereich</Link>
                </Button>
                <Button asChild className='bg-fanini-blue-600 hover:bg-fanini-blue-700'>
                  <Link to='/app'>Login</Link>
                </Button>

                {/* Mobile Menu for Public */}
                <Sheet>
                  <SheetTrigger asChild className='lg:hidden'>
                    <Button variant='ghost' size='icon'>
                      <Menu className='h-5 w-5' />
                    </Button>
                  </SheetTrigger>
                  <SheetContent>
                    <nav className='mt-8 flex flex-col gap-4'>
                      <Link to='/' className='text-lg font-medium'>
                        Home
                      </Link>
                      <Link to='/app/events' className='text-lg font-medium'>
                        Events
                      </Link>
                      <Link to='/kontakt' className='text-lg font-medium'>
                        Kontakt
                      </Link>
                      <Link to='/impressum' className='text-lg font-medium'>
                        Über uns
                      </Link>
                      <hr className='my-4' />
                      <Button asChild className='w-full'>
                        <Link to='/app'>Zum Mitgliederbereich</Link>
                      </Button>
                    </nav>
                  </SheetContent>
                </Sheet>
              </>
            ) : (
              <>
                <Button variant='ghost' size='icon' className='relative'>
                  <Bell className='h-5 w-5' />
                  <span className='bg-fanini-red-500 absolute top-0 right-0 h-2 w-2 animate-pulse rounded-full' />
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant='ghost' size='icon' className='rounded-full'>
                      <div className='from-fanini-blue-400 to-fanini-blue-600 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br'>
                        <User className='h-4 w-4 text-white' />
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align='end' className='w-56'>
                    <div className='px-2 py-1.5'>
                      <p className='text-sm font-medium'>Max Mustermann</p>
                      <p className='text-muted-foreground text-xs'>max@fanini.live</p>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to='/app/profile'>Mein Profil</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to='/app/members'>Einstellungen</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className='text-destructive focus:text-destructive'>
                      Abmelden
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}
          </div>
        </div>
      </Container>
    </header>
  );
};

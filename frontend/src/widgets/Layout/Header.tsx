import { Container } from '@/shared/ui/layout/Container';
import { Button, Sheet, SheetContent, SheetTrigger } from '@shared/shadcn';
import { Link } from '@tanstack/react-router';
import { Menu, Users } from 'lucide-react';
import { useState } from 'react';

export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Events', href: '/events' },
    { name: 'Über uns', href: '/about' },
    { name: 'Kontakt', href: '/kontakt' },
  ];

  return (
    <header className='bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur'>
      <Container>
        <div className='flex h-16 items-center justify-between'>
          {/* Logo */}
          <Link to='/' className='flex items-center gap-2'>
            <div className='relative'>
              <div className='flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-fanini-blue)]'>
                <span className='text-lg font-bold text-white'>F</span>
              </div>
              <div className='absolute -right-1 -bottom-1 h-3 w-3 rounded-full bg-[var(--color-fanini-red)]' />
            </div>
            <span className='hidden font-[Bebas_Neue] text-xl text-[var(--color-fanini-blue)] sm:block'>
              Faninitiative Spandau
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className='hidden items-center gap-6 md:flex'>
            {navigation.map(item => (
              <Link
                key={item.name}
                to={item.href}
                className='text-sm font-medium transition-colors hover:text-[var(--color-fanini-blue)]'
                activeProps={{
                  className: 'text-[var(--color-fanini-blue)]',
                }}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className='hidden items-center gap-4 md:flex'>
            <Button variant='outline' asChild>
              <Link to='/app'>
                <Users className='mr-2 h-4 w-4' />
                Mitgliederbereich
              </Link>
            </Button>
          </div>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className='md:hidden'>
              <Button variant='ghost' size='icon'>
                <Menu className='h-5 w-5' />
                <span className='sr-only'>Menü öffnen</span>
              </Button>
            </SheetTrigger>
            <SheetContent side='right' className='w-[300px] sm:w-[400px]'>
              <nav className='mt-8 flex flex-col gap-4'>
                {navigation.map(item => (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsOpen(false)}
                    className='text-lg font-medium transition-colors hover:text-[var(--color-fanini-blue)]'
                    activeProps={{
                      className: 'text-[var(--color-fanini-blue)]',
                    }}
                  >
                    {item.name}
                  </Link>
                ))}
                <hr className='my-4' />
                <Button asChild className='w-full' onClick={() => setIsOpen(false)}>
                  <Link to='/app'>
                    <Users className='mr-2 h-4 w-4' />
                    Mitgliederbereich
                  </Link>
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </Container>
    </header>
  );
};

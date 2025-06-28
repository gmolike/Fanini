import type { ReactNode } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';

type PublicLayoutProps = {
  children: ReactNode;
};

export const PublicLayout = ({ children }: PublicLayoutProps) => {
  return (
    <div className='bg-background flex min-h-screen flex-col'>
      <Header />
      <main className='flex-1'>{children}</main>
      <Footer />
    </div>
  );
};

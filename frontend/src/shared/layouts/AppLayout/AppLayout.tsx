import { Outlet } from '@tanstack/react-router'
import { Header } from '../components/Header'
import { Footer } from '../components/Footer'
import { cn } from '@/shared/lib/utils'
import { appLayoutConfig } from './AppLayout.config'

interface AppLayoutProps {
  children?: React.ReactNode
  className?: string
}

export function AppLayout({ children, className }: AppLayoutProps) {
  return (
    <div className={appLayoutConfig.wrapper}>
      <Header />
      <main className={cn(appLayoutConfig.main, className)}>{children || <Outlet />}</main>
      <Footer />
    </div>
  )
}

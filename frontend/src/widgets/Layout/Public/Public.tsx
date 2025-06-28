import * as React from 'react'
import { Outlet } from '@tanstack/react-router'
import { Footer, Header } from '@/shared/ui/layout'


/**
 * PublicLayout Widget
 * @description Layout für öffentliche Seiten mit Header und Footer
 */
export const PublicLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

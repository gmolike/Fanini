import * as React from 'react'
import { Outlet } from '@tanstack/react-router'
import { Footer, Header } from '@/shared/ui/layout'
import { Sidebar } from '@/widgets/Navigation/Sidebar/Sidebar'

/**
 * AppLayout Widget
 * @description Layout für Mitgliederbereich mit Sidebar-Navigation
 */
export const AppLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  )
}

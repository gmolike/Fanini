import { Outlet } from '@tanstack/react-router'
import { Header } from './Header'
import { Sidebar } from './Sidebar'

export const AppLayout = () => {
  return (
    <div className="h-screen flex flex-col bg-background">
      <Header />

      <div className="flex-1 flex overflow-hidden">
        <Sidebar />

        <main className="flex-1 overflow-y-auto">
          <div className="container-fluid h-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

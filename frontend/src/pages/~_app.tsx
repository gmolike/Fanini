import { createFileRoute, Outlet } from '@tanstack/react-router'
import { Header } from '@/widgets/Navigation/Header/Header'
import { Sidebar } from '@/widgets/Navigation/Sidebar/Sidebar'

export const Route = createFileRoute('/_app')({
  component: AppLayoutComponent,
})

function AppLayoutComponent() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

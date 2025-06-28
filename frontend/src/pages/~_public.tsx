import { Footer } from '@/widgets/Navigation/Footer/Footer'
import { Header } from '@/widgets/Navigation/Header/Header'
import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/_public')({
  component: PublicLayoutComponent,
})

function PublicLayoutComponent() {
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

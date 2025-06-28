// frontend/src/widgets/Layout/PublicLayout.tsx
import { ReactNode } from 'react'
import { Header } from './Header'
import { Footer } from './Footer'

type PublicLayoutProps = {
  children: ReactNode
}

export const PublicLayout = ({ children }: PublicLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}

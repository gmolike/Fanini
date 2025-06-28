import * as React from 'react'
import { Link, Outlet } from '@tanstack/react-router'
import { Container } from '@/shared/ui/layout/Container'

/**
 * AuthLayout Widget
 * @description Minimales Layout für Login/Register Seiten
 */
export const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      {/* Simple Header */}
      <header className="border-b bg-background">
        <Container>
          <div className="flex h-16 items-center">
            <Link to="/" className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-lg font-bold text-primary-foreground">F</span>
              </div>
              <div>
                <div className="font-heading text-xl font-bold text-primary">Fanini</div>
                <div className="text-xs text-muted-foreground -mt-1">Spandau e.V.</div>
              </div>
            </Link>
          </div>
        </Container>
      </header>

      {/* Auth Content */}
      <main className="flex-1 flex items-center justify-center p-6">
        <Outlet />
      </main>

      {/* Simple Footer */}
      <footer className="border-t bg-background">
        <Container>
          <div className="py-6 text-center">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Faninitiative Spandau e.V.
            </p>
          </div>
        </Container>
      </footer>
    </div>
  )
}

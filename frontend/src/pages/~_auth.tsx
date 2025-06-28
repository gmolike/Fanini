import { createFileRoute, Outlet, Link } from '@tanstack/react-router'
import { Container } from '@/shared/ui/layout/Container'

export const Route = createFileRoute('/_auth')({
  component: AuthLayoutComponent,
})

function AuthLayoutComponent() {
  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
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

      <main className="flex-1 flex items-center justify-center p-6">
        <Outlet />
      </main>

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

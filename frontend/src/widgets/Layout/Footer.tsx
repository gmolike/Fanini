// frontend/src/widgets/Layout/Footer.tsx
import { Link } from '@tanstack/react-router'
import { Container } from '@/shared/ui/layout/Container'

export const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t bg-muted/30 mt-auto">
      <Container>
        <div className="py-8">
          <div className="grid gap-8 md:grid-cols-3">
            <div>
              <h3 className="font-heading text-lg font-semibold mb-2">
                Faninitiative Spandau e.V.
              </h3>
              <p className="text-sm text-muted-foreground">
                Der offizielle Fanverein der Eintracht Spandau
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Rechtliches</h4>
              <ul className="space-y-1 text-sm">
                <li>
                  <Link to="/impressum" className="text-muted-foreground hover:text-foreground">
                    Impressum
                  </Link>
                </li>
                <li>
                  <Link to="/datenschutz" className="text-muted-foreground hover:text-foreground">
                    Datenschutz
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Kontakt</h4>
              <p className="text-sm text-muted-foreground">info@fanini.live</p>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t text-center">
            <p className="text-sm text-muted-foreground">
              © {currentYear} Faninitiative Spandau e.V.
            </p>
          </div>
        </div>
      </Container>
    </footer>
  )
}

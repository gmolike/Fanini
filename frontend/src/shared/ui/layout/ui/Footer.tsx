import { cn } from '@/shared/lib'
import { Link } from '@tanstack/react-router'
import type { FooterProps } from '../model/types'

/**
 * Footer Komponente
 * @description Footer mit Vereinsinformationen und Links
 */
export const Footer = ({ className }: FooterProps) => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className={cn('border-t bg-muted/50', className)}>
      <div className="container py-8">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <h3 className="mb-3 font-heading text-lg font-semibold">Faninitiative Spandau e.V.</h3>
            <p className="text-sm text-muted-foreground">
              Der offizielle Fanverein der Eintracht Spandau
            </p>
          </div>

          <div>
            <h4 className="mb-3 font-semibold">Rechtliches</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/imprint" className="text-muted-foreground hover:text-[#34687e]">
                  Impressum
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-muted-foreground hover:text-[#34687e]">
                  Datenschutz
                </Link>
              </li>
              <li>
                <Link to="/verein/satzung" className="text-muted-foreground hover:text-[#34687e]">
                  Satzung
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 font-semibold">Kontakt</h4>
            <p className="text-sm text-muted-foreground">info@fanini.live</p>
          </div>
        </div>

        <div className="mt-8 border-t pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            © {currentYear} Faninitiative Spandau e.V. Alle Rechte vorbehalten.
          </p>
        </div>
      </div>
    </footer>
  )
}

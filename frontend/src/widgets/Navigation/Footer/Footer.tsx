import * as React from 'react'
import { Mail, MapPin } from 'lucide-react'
import { Container } from '@/shared/ui/layout/Container'
import { NavLink } from '@/shared/ui/navigation/NavLink'

/**
 * Footer Komponente
 * @description Vereinsfooter mit Links, Kontaktdaten und rechtlichen Informationen
 */
export const Footer: React.FC<{ className?: string }> = ({ className }) => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className={className}>
      <div className="border-t bg-muted/30">
        <Container>
          <div className="py-12">
            <div className="grid gap-8 md:grid-cols-4">
              {/* Verein Info */}
              <div className="space-y-4">
                <div>
                  <div className="font-heading text-lg font-bold text-primary">
                    Faninitiative Spandau e.V.
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Der offizielle Fanverein der Eintracht Spandau
                  </p>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    <span>info@fanini.live</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>Berlin-Spandau</span>
                  </div>
                </div>
              </div>

              {/* Verein */}
              <div>
                <h4 className="font-semibold mb-4">Verein</h4>
                <ul className="space-y-2 text-sm">
                  <li><NavLink to="/verein" variant="ghost">Über uns</NavLink></li>
                  <li><NavLink to="/verein/vorstand" variant="ghost">Vorstand</NavLink></li>
                  <li><NavLink to="/verein/satzung" variant="ghost">Satzung</NavLink></li>
                  <li><NavLink to="/verein/mitglieder" variant="ghost">Mitglieder</NavLink></li>
                  <li><NavLink to="/mitglied-werden" variant="ghost">Mitglied werden</NavLink></li>
                </ul>
              </div>

              {/* Content */}
              <div>
                <h4 className="font-semibold mb-4">Inhalte</h4>
                <ul className="space-y-2 text-sm">
                  <li><NavLink to="/events" variant="ghost">Events</NavLink></li>
                  <li><NavLink to="/rueckblicke" variant="ghost">Rückblicke</NavLink></li>
                  <li><NavLink to="/medien" variant="ghost">Medien</NavLink></li>
                  <li><NavLink to="/kuenstler" variant="ghost">Künstler</NavLink></li>
                  <li><NavLink to="/team" variant="ghost">Team</NavLink></li>
                </ul>
              </div>

              {/* Rechtliches */}
              <div>
                <h4 className="font-semibold mb-4">Rechtliches</h4>
                <ul className="space-y-2 text-sm">
                  <li><NavLink to="/impressum" variant="ghost">Impressum</NavLink></li>
                  <li><NavLink to="/datenschutz" variant="ghost">Datenschutz</NavLink></li>
                  <li><NavLink to="/kontakt" variant="ghost">Kontakt</NavLink></li>
                </ul>
              </div>
            </div>
          </div>
        </Container>
      </div>

      {/* Copyright */}
      <div className="border-t bg-muted/50">
        <Container>
          <div className="py-6 text-center">
            <p className="text-sm text-muted-foreground">
              © {currentYear} Faninitiative Spandau e.V. Alle Rechte vorbehalten.
            </p>
          </div>
        </Container>
      </div>
    </footer>
  )
}

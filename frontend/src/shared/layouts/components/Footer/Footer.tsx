import { Link } from '@tanstack/react-router'
import { cn } from '@/shared/lib/utils'
import { footerConfig } from './Footer.config'

interface FooterProps {
  className?: string
}

export function Footer({ className }: FooterProps) {
  const currentYear = new Date().getFullYear()

  return (
    <footer className={cn(footerConfig.base, className)}>
      <div className={footerConfig.container}>
        <div className={footerConfig.grid}>
          <div>
            <h3 className={footerConfig.heading}>Faninitiative Spandau e.V.</h3>
            <p className={footerConfig.text}>Der offizielle Fanverein der Eintracht Spandau</p>
          </div>
          <div>
            <h4 className={footerConfig.heading}>Links</h4>
            <ul className={footerConfig.list}>
              <li>
                <Link to="/imprint" className={footerConfig.link}>
                  Impressum
                </Link>
              </li>
              <li>
                <Link to="/privacy" className={footerConfig.link}>
                  Datenschutz
                </Link>
              </li>
              <li>
                <Link to="/statute" className={footerConfig.link}>
                  Satzung
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className={footerConfig.bottom}>
          <p className={footerConfig.copyright}>
            © {currentYear} Faninitiative Spandau e.V. Alle Rechte vorbehalten.
          </p>
        </div>
      </div>
    </footer>
  )
}

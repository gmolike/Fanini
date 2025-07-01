// frontend/src/widgets/Layout/Footer.tsx
import { Link } from '@tanstack/react-router';
import { Mail, MapPin } from 'lucide-react';

import { Container } from '@/shared/ui/layout/Container';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      name: 'facebook',
      href: 'https://facebook.com/faninitiativespandau',
      icon: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z',
    },
    {
      name: 'instagram',
      href: 'https://instagram.com/fanini_spandau',
      icon: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1112.324 0 6.162 6.162 0 01-12.324 0zM12 16a4 4 0 110-8 4 4 0 010 8zm4.965-10.405a1.44 1.44 0 112.881.001 1.44 1.44 0 01-2.881-.001z',
    },
    {
      name: 'x',
      href: 'https://x.com/fanini_spandau',
      icon: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z',
    },
  ];

  return (
    <footer className="border-t bg-[var(--color-muted)] dark:bg-[var(--color-card)]">
      <Container>
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 gap-8 py-12 md:grid-cols-2 lg:grid-cols-4">
          {/* About Section */}
          <div>
            <div className="mb-4 flex items-center gap-2">
              <img
                src="/images/logo.png"
                alt="Faninitiative Spandau e.V."
                className="h-8 w-8 object-contain"
              />
              <span className="font-[Bebas_Neue] text-lg text-[var(--color-fanini-blue)]">
                Faninitiative Spandau
              </span>
            </div>
            <p className="text-sm text-[var(--color-muted-foreground)]">
              Der offizielle Fanverein der Eintracht Spandau. Gemeinsam für unseren Verein seit
              2022.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 font-semibold text-[var(--color-foreground)]">Schnellzugriff</h3>
            <ul className="space-y-2">
              {['Events', 'Über uns', 'Mitgliederbereich', 'Vereinssatzung'].map((item, index) => {
                let linkPath = '';
                if (index === 0) {
                  linkPath = '/events';
                } else if (index === 1) {
                  linkPath = '/about';
                } else if (index === 2) {
                  linkPath = '/app';
                } else {
                  linkPath = '/satzung';
                }
                return (
                  <li key={item}>
                    <Link
                      to={linkPath}
                      className="text-sm text-[var(--color-muted-foreground)] transition-colors hover:text-[var(--color-fanini-blue)]"
                    >
                      {item}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-4 font-semibold text-[var(--color-foreground)]">Kontakt</h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-sm text-[var(--color-muted-foreground)]">
                <Mail className="h-4 w-4" />
                <a
                  href="mailto:info@fanini.live"
                  className="transition-colors hover:text-[var(--color-fanini-blue)]"
                >
                  info@fanini.live
                </a>
              </li>
              <li className="flex items-start gap-2 text-sm text-[var(--color-muted-foreground)]">
                <MapPin className="mt-0.5 h-4 w-4" />
                <span>
                  Vereinsheim
                  <br />
                  13587 Berlin-Spandau
                </span>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="mb-4 font-semibold text-[var(--color-foreground)]">Folge uns</h3>
            <div className="flex gap-3">
              {socialLinks.map(social => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-background)] transition-all hover:bg-[var(--color-fanini-blue)]"
                  aria-label={social.name}
                >
                  <svg
                    className="h-5 w-5 fill-[var(--color-muted-foreground)] transition-colors group-hover:fill-white"
                    viewBox="0 0 24 24"
                  >
                    <path d={social.icon} />
                  </svg>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t py-4">
          <div className="flex flex-col items-center justify-between gap-4 text-sm text-[var(--color-muted-foreground)] sm:flex-row">
            <p>© {currentYear} Faninitiative Spandau e.V. Alle Rechte vorbehalten.</p>
            <div className="flex gap-4">
              <Link
                to="/impressum"
                className="transition-colors hover:text-[var(--color-fanini-blue)]"
              >
                Impressum
              </Link>
              <Link
                to="/datenschutz"
                className="transition-colors hover:text-[var(--color-fanini-blue)]"
              >
                Datenschutz
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
};

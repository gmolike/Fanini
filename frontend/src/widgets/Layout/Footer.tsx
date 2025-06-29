// frontend/src/widgets/Navigation/Footer.tsx
import { Link } from '@tanstack/react-router';
import { Mail, MapPin } from 'lucide-react';

import { SocialIcon } from '@/shared/ui/icons/SocialIcon';
import { socialIcons } from '@/shared/ui/icons/socialIcons';
import { Container } from '@/shared/ui/layout/Container';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { name: 'facebook', href: 'https://facebook.com/faninitiativespandau' },
    { name: 'instagram', href: 'https://instagram.com/fanini_spandau' },
    { name: 'x', href: 'https://x.com/fanini_spandau' },
  ];

  return (
    <footer className='border-t bg-[var(--color-muted)]'>
      <Container>
        {/* Main Footer Content */}
        <div className='grid grid-cols-1 gap-8 py-12 md:grid-cols-2 lg:grid-cols-4'>
          {/* About Section */}
          <div>
            <div className='mb-4 flex items-center gap-2'>
              <div className='flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-fanini-blue)]'>
                <span className='text-sm font-bold text-white'>F</span>
              </div>
              <span className='font-[Bebas_Neue] text-lg text-[var(--color-fanini-blue)]'>
                Faninitiative Spandau
              </span>
            </div>
            <p className='text-sm text-[var(--color-muted-foreground)]'>
              Der offizielle Fanverein der Eintracht Spandau. Gemeinsam für unseren Verein seit
              2022.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className='mb-4 font-semibold'>Schnellzugriff</h3>
            <ul className='space-y-2'>
              <li>
                <Link
                  to='/events'
                  className='text-sm text-[var(--color-muted-foreground)] transition-colors hover:text-[var(--color-fanini-blue)]'
                >
                  Aktuelle Events
                </Link>
              </li>
              <li>
                <Link
                  to='/about'
                  className='text-sm text-[var(--color-muted-foreground)] transition-colors hover:text-[var(--color-fanini-blue)]'
                >
                  Über uns
                </Link>
              </li>
              <li>
                <Link
                  to='/app'
                  className='text-sm text-[var(--color-muted-foreground)] transition-colors hover:text-[var(--color-fanini-blue)]'
                >
                  Mitgliederbereich
                </Link>
              </li>
              <li>
                <Link
                  to='/satzung'
                  className='text-sm text-[var(--color-muted-foreground)] transition-colors hover:text-[var(--color-fanini-blue)]'
                >
                  Vereinssatzung
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className='mb-4 font-semibold'>Kontakt</h3>
            <ul className='space-y-2'>
              <li className='flex items-center gap-2 text-sm text-[var(--color-muted-foreground)]'>
                <Mail className='h-4 w-4' />
                <a
                  href='mailto:info@fanini.live'
                  className='transition-colors hover:text-[var(--color-fanini-blue)]'
                >
                  info@fanini.live
                </a>
              </li>
              <li className='flex items-start gap-2 text-sm text-[var(--color-muted-foreground)]'>
                <MapPin className='mt-0.5 h-4 w-4' />
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
            <h3 className='mb-4 font-semibold'>Folge uns</h3>
            <div className='flex gap-3'>
              {socialLinks.map(social => {
                const icon = socialIcons[social.name as keyof typeof socialIcons];
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='group flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-background)] transition-all hover:bg-[var(--color-fanini-blue)] hover:text-white'
                    aria-label={icon.title}
                  >
                    <SocialIcon
                      icon={icon.path}
                      size={20}
                      className='text-[var(--color-muted-foreground)] transition-colors group-hover:text-white'
                    />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className='border-t py-4'>
          <div className='flex flex-col items-center justify-between gap-4 text-sm text-[var(--color-muted-foreground)] sm:flex-row'>
            <p>© {currentYear} Faninitiative Spandau e.V. Alle Rechte vorbehalten.</p>
            <div className='flex gap-4'>
              <Link
                to='/impressum'
                className='transition-colors hover:text-[var(--color-fanini-blue)]'
              >
                Impressum
              </Link>
              <Link
                to='/datenschutz'
                className='transition-colors hover:text-[var(--color-fanini-blue)]'
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

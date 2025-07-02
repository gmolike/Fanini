// frontend/src/widgets/home/Hero/Hero.tsx
import { Link } from '@tanstack/react-router';
import { ArrowRight } from 'lucide-react';

import { Button } from '@/shared/shadcn';
import { Container } from '@/shared/ui';

/**
 * Hero Widget für die Startseite
 * @description Hauptbanner mit Call-to-Action Buttons und Vereinsbranding
 */
export const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[var(--color-fanini-blue)] to-[var(--color-fanini-blue)]/90 py-20 sm:py-32">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute -top-4 -left-4 h-72 w-72 rounded-full bg-white/20 blur-3xl" />
        <div className="absolute -right-8 -bottom-8 h-96 w-96 rounded-full bg-[var(--color-fanini-red)]/20 blur-3xl" />
      </div>

      <Container className="relative">
        <div className="mx-auto max-w-3xl text-center">
          {/* Logo */}
          <div className="mb-8 flex justify-center">
            <div className="relative">
              <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-white shadow-2xl">
                <img
                  src="/images/logo.png"
                  alt="Faninitiative Spandau e.V."
                  className="h-20 w-20 object-contain"
                />
              </div>
              <div className="absolute -right-2 -bottom-2 h-8 w-8 rounded-full bg-[var(--color-fanini-red)] shadow-lg" />
            </div>
          </div>

          {/* Heading */}
          <h1 className="mb-6 font-[Bebas_Neue] text-5xl text-white sm:text-6xl lg:text-7xl">
            Gemeinsam für{' '}
            <span className="relative">
              <span className="relative z-10 text-[var(--color-fanini-red)]">
                Eintracht Spandau
              </span>
              <span className="absolute -bottom-2 left-0 h-3 w-full bg-white/20 blur-sm" />
            </span>
          </h1>

          {/* Subheading */}
          <p className="mx-auto mb-10 max-w-2xl text-lg text-white/90 sm:text-xl">
            Die Faninitiative Spandau e.V. ist der offizielle Fanverein der Eintracht Spandau. Seit
            2025 vereinen wir Fans und schaffen unvergessliche Momente.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Button
              size="lg"
              className="bg-[var(--color-fanini-red)] text-white shadow-lg hover:bg-[var(--color-fanini-red)]/90"
              asChild
            >
              <Link to="/app">
                Mitglied werden
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white bg-white/10 text-white backdrop-blur hover:bg-white/20"
              asChild
            >
              <Link to="/about">Mehr über uns</Link>
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
};

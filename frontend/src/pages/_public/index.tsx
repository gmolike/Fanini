// frontend/src/pages/~_public/~index.tsx
import { createFileRoute } from '@tanstack/react-router';
import { ArrowRight, Calendar, Users, Trophy } from 'lucide-react';

import { Button, Card, CardContent } from '@/shared/shadcn';
import { Container } from '@/shared/ui/layout/Container';

export const Route = createFileRoute('/_public/')({
  component: HomePage,
});

function HomePage() {
  return (
    <>
      {/* Hero Section - Mobile First */}
      <section className="relative overflow-hidden py-16 sm:py-20 lg:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-fanini-blue)] to-[var(--color-fanini-blue)]/80" />
        <div className="absolute inset-0 opacity-10" />

        <Container className="relative">
          <div className="max-w-3xl">
            <h1 className="mb-4 font-[Bebas_Neue] text-4xl text-white sm:text-5xl lg:text-6xl">
              Gemeinsam für{' '}
              <span className="text-[var(--color-fanini-red)]">Eintracht Spandau</span>
            </h1>
            <p className="mb-8 text-lg text-white/90 sm:text-xl">
              Seit 2022 vereinen wir die Fans der Eintracht Spandau. Werde Teil unserer
              leidenschaftlichen Community!
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Button
                size="lg"
                className="bg-[var(--color-fanini-red)] hover:bg-[var(--color-fanini-red)]/90"
              >
                Mitglied werden
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white bg-white/10 text-white hover:bg-white/20"
              >
                Mehr erfahren
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* Stats Section */}
      <section className="bg-[var(--color-muted)] py-12">
        <Container>
          <div className="grid grid-cols-2 gap-4 sm:gap-8 lg:grid-cols-4">
            {[
              { icon: Users, value: '156+', label: 'Aktive Mitglieder' },
              { icon: Calendar, value: '24', label: 'Events pro Jahr' },
              { icon: Trophy, value: '2022', label: 'Gegründet' },
              { icon: ArrowRight, value: '100%', label: 'Leidenschaft' },
            ].map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div key={i} className="text-center">
                  <Icon className="mx-auto mb-2 h-8 w-8 text-[var(--color-fanini-blue)]" />
                  <div className="text-2xl font-bold text-[var(--color-fanini-blue)] sm:text-3xl">
                    {stat.value}
                  </div>
                  <div className="text-sm text-[var(--color-muted-foreground)]">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* Next Events */}
      <section className="py-16 sm:py-20">
        <Container>
          <div className="mb-12 text-center">
            <h2 className="mb-4 font-[Bebas_Neue] text-3xl text-[var(--color-fanini-blue)] sm:text-4xl">
              Nächste Events
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-[var(--color-muted-foreground)]">
              Verpasse keine Veranstaltung und sei bei allen wichtigen Terminen dabei
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Event Cards - Placeholder für echte Events */}
            {[1, 2, 3].map(i => (
              <Card key={i} className="group transition-all duration-300 hover:shadow-lg">
                <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-[var(--color-fanini-blue)] to-[var(--color-fanini-blue)]/80">
                  <div className="absolute inset-0 bg-black/20" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <div className="text-3xl font-bold">28</div>
                    <div className="text-sm uppercase">Januar</div>
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="mb-2 text-xl font-semibold transition-colors group-hover:text-[var(--color-fanini-blue)]">
                    Rückrundenstart-Party
                  </h3>
                  <p className="mb-4 text-[var(--color-muted-foreground)]">
                    Gemeinsam in die zweite Saisonhälfte!
                  </p>
                  <Button variant="ghost" className="h-auto p-0 text-[var(--color-fanini-blue)]">
                    Mehr erfahren →
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}

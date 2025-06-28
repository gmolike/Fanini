// frontend/src/pages/~_public/~index.tsx
import { createFileRoute } from '@tanstack/react-router';
import { Button, Card, CardContent } from '@/shared/shadcn';
import { ArrowRight, Calendar, Users, Trophy } from 'lucide-react';
import { Container } from '@/shared/ui/layout/Container';

export const Route = createFileRoute('/_public/')({
  component: HomePage,
});

function HomePage() {
  return (
    <>
      {/* Hero Section - Mobile First */}
      <section className="relative py-16 sm:py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-fanini-blue)] to-[var(--color-fanini-blue)]/80" />
        <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10" />

        <Container className="relative">
          <div className="max-w-3xl">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-[Bebas_Neue] text-white mb-4">
              Gemeinsam für <span className="text-[var(--color-fanini-red)]">Eintracht Spandau</span>
            </h1>
            <p className="text-lg sm:text-xl text-white/90 mb-8">
              Seit 2022 vereinen wir die Fans der Eintracht Spandau.
              Werde Teil unserer leidenschaftlichen Community!
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-[var(--color-fanini-red)] hover:bg-[var(--color-fanini-red)]/90">
                Mitglied werden
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" className="bg-white/10 border-white text-white hover:bg-white/20">
                Mehr erfahren
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-[var(--color-muted)]">
        <Container>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
            {[
              { icon: Users, value: '156+', label: 'Aktive Mitglieder' },
              { icon: Calendar, value: '24', label: 'Events pro Jahr' },
              { icon: Trophy, value: '2022', label: 'Gegründet' },
              { icon: ArrowRight, value: '100%', label: 'Leidenschaft' },
            ].map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div key={i} className="text-center">
                  <Icon className="h-8 w-8 mx-auto mb-2 text-[var(--color-fanini-blue)]" />
                  <div className="text-2xl sm:text-3xl font-bold text-[var(--color-fanini-blue)]">
                    {stat.value}
                  </div>
                  <div className="text-sm text-[var(--color-muted-foreground)]">
                    {stat.label}
                  </div>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* Next Events */}
      <section className="py-16 sm:py-20">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-[Bebas_Neue] text-[var(--color-fanini-blue)] mb-4">
              Nächste Events
            </h2>
            <p className="text-lg text-[var(--color-muted-foreground)] max-w-2xl mx-auto">
              Verpasse keine Veranstaltung und sei bei allen wichtigen Terminen dabei
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Event Cards - Placeholder für echte Events */}
            {[1, 2, 3].map((i) => (
              <Card key={i} className="group hover:shadow-lg transition-all duration-300">
                <div className="aspect-video bg-gradient-to-br from-[var(--color-fanini-blue)] to-[var(--color-fanini-blue)]/80 relative overflow-hidden">
                  <div className="absolute inset-0 bg-black/20" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <div className="text-3xl font-bold">28</div>
                    <div className="text-sm uppercase">Januar</div>
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-[var(--color-fanini-blue)] transition-colors">
                    Rückrundenstart-Party
                  </h3>
                  <p className="text-[var(--color-muted-foreground)] mb-4">
                    Gemeinsam in die zweite Saisonhälfte!
                  </p>
                  <Button variant="ghost" className="text-[var(--color-fanini-blue)] p-0 h-auto">
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

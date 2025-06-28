import { createFileRoute } from '@tanstack/react-router';
import { PublicLayout } from '@/widgets/Layout';
import { Container } from '@/shared/ui/layout/Container';
import { Button } from '@/shared/shadcn/button';

export const Route = createFileRoute('/')({
  component: HomePage,
});

function HomePage() {
  return (
    <PublicLayout>
      {/* Hero Section mit Banner */}
      <section className='from-fanini-blue-600 to-fanini-blue-700 relative overflow-hidden bg-gradient-to-br text-white'>
        <div className='absolute inset-0 bg-black/20' />
        <div className='bg-fanini-red-500/20 absolute -right-32 -bottom-32 h-96 w-96 rounded-full blur-3xl' />
        <div className='bg-fanini-blue-400/20 absolute -top-32 -left-32 h-96 w-96 rounded-full blur-3xl' />

        <Container className='relative py-20 lg:py-32'>
          <div className='grid items-center gap-12 lg:grid-cols-2'>
            <div className='space-y-6'>
              <h1 className='font-heading animate-fade-in text-5xl font-bold lg:text-7xl'>
                FANINITIATIVE
                <span className='text-fanini-red-400 block'>SPANDAU</span>
              </h1>
              <p className='text-xl font-light text-white/90 lg:text-2xl'>
                Der offizielle Fanverein der Eintracht Spandau - gemeinsam stark seit 2022
              </p>
              <div className='flex flex-wrap gap-4'>
                <Button
                  asChild
                  size='lg'
                  className='bg-fanini-red-500 hover:bg-fanini-red-600 text-white'
                >
                  <a href='/app'>Mitgliederbereich</a>
                </Button>
                <Button
                  asChild
                  size='lg'
                  variant='outline'
                  className='border-white text-white hover:bg-white/10'
                >
                  <a href='#events'>Nächste Events</a>
                </Button>
              </div>
            </div>

            <div className='relative'>
              <div className='mx-auto aspect-square max-w-md'>
                <img
                  src='/api/placeholder/400/400'
                  alt='Faninitiative Spandau Logo'
                  className='h-full w-full object-contain drop-shadow-2xl'
                />
                {/* Placeholder für das Logo-Bild */}
                <div className='absolute inset-0 flex items-center justify-center'>
                  <div className='rounded-full bg-black/50 p-8 backdrop-blur-sm'>
                    <span className='text-4xl font-bold'>FANINI</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Stats Section */}
      <section className='bg-fanini-blue-50 py-12'>
        <Container>
          <div className='grid grid-cols-2 gap-8 text-center md:grid-cols-4'>
            <div>
              <div className='text-fanini-blue-600 text-4xl font-bold'>150+</div>
              <div className='text-muted-foreground mt-1 text-sm'>Aktive Mitglieder</div>
            </div>
            <div>
              <div className='text-fanini-blue-600 text-4xl font-bold'>24</div>
              <div className='text-muted-foreground mt-1 text-sm'>Events pro Jahr</div>
            </div>
            <div>
              <div className='text-fanini-blue-600 text-4xl font-bold'>2022</div>
              <div className='text-muted-foreground mt-1 text-sm'>Gegründet</div>
            </div>
            <div>
              <div className='text-fanini-blue-600 text-4xl font-bold'>100%</div>
              <div className='text-muted-foreground mt-1 text-sm'>Leidenschaft</div>
            </div>
          </div>
        </Container>
      </section>

      {/* Events Section */}
      <section id='events' className='py-20'>
        <Container>
          <div className='mb-12 text-center'>
            <h2 className='font-heading text-fanini-blue-700 mb-4 text-4xl font-bold'>
              Kommende Events
            </h2>
            <p className='text-muted-foreground mx-auto max-w-2xl text-lg'>
              Sei dabei wenn wir gemeinsam unsere Eintracht unterstützen
            </p>
          </div>

          <div className='grid gap-8 md:grid-cols-2 lg:grid-cols-3'>
            {/* Event Card 1 */}
            <div className='group bg-card overflow-hidden rounded-xl shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl'>
              <div className='from-fanini-red-400 to-fanini-red-600 relative aspect-video overflow-hidden bg-gradient-to-br'>
                <div className='absolute inset-0 bg-black/30' />
                <div className='absolute bottom-4 left-4 text-white'>
                  <div className='text-3xl font-bold'>28</div>
                  <div className='text-sm uppercase'>Januar</div>
                </div>
              </div>
              <div className='p-6'>
                <h3 className='group-hover:text-fanini-blue-600 mb-2 text-xl font-semibold transition-colors'>
                  Rückrundenstart-Party
                </h3>
                <p className='text-muted-foreground mb-4'>
                  Gemeinsam in die zweite Saisonhälfte! Mit Live-Musik und Überraschungsgästen.
                </p>
                <Button variant='ghost' className='text-fanini-blue-600 hover:text-fanini-blue-700'>
                  Mehr erfahren →
                </Button>
              </div>
            </div>

            {/* Event Card 2 */}
            <div className='group bg-card overflow-hidden rounded-xl shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl'>
              <div className='from-fanini-blue-400 to-fanini-blue-600 relative aspect-video overflow-hidden bg-gradient-to-br'>
                <div className='absolute inset-0 bg-black/30' />
                <div className='absolute bottom-4 left-4 text-white'>
                  <div className='text-3xl font-bold'>14</div>
                  <div className='text-sm uppercase'>Februar</div>
                </div>
              </div>
              <div className='p-6'>
                <h3 className='group-hover:text-fanini-blue-600 mb-2 text-xl font-semibold transition-colors'>
                  Auswärtsfahrt Berlin
                </h3>
                <p className='text-muted-foreground mb-4'>
                  Zusammen zum Derby! Busfahrt, Stadionbesuch und After-Match-Party inklusive.
                </p>
                <Button variant='ghost' className='text-fanini-blue-600 hover:text-fanini-blue-700'>
                  Jetzt anmelden →
                </Button>
              </div>
            </div>

            {/* Event Card 3 */}
            <div className='group bg-card overflow-hidden rounded-xl shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl'>
              <div className='relative aspect-video overflow-hidden bg-gradient-to-br from-gray-400 to-gray-600'>
                <div className='absolute inset-0 bg-black/30' />
                <div className='absolute bottom-4 left-4 text-white'>
                  <div className='text-3xl font-bold'>??</div>
                  <div className='text-sm uppercase'>Bald</div>
                </div>
              </div>
              <div className='p-6'>
                <h3 className='group-hover:text-fanini-blue-600 mb-2 text-xl font-semibold transition-colors'>
                  Überraschungsevent
                </h3>
                <p className='text-muted-foreground mb-4'>
                  Etwas Großes ist in Planung! Haltet die Augen offen für weitere Infos.
                </p>
                <Button variant='ghost' className='text-fanini-blue-600 hover:text-fanini-blue-700'>
                  Coming Soon →
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Gallery Section */}
      <section className='bg-fanini-blue-50 py-20'>
        <Container>
          <div className='mb-12 text-center'>
            <h2 className='font-heading text-fanini-blue-700 mb-4 text-4xl font-bold'>
              Unsere Community
            </h2>
            <p className='text-muted-foreground mx-auto max-w-2xl text-lg'>
              Eindrücke aus dem Vereinsleben - von Fans für Fans
            </p>
          </div>

          <div className='grid grid-cols-2 gap-4 md:grid-cols-4'>
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <div
                key={i}
                className='from-fanini-blue-100 to-fanini-red-100 group aspect-square cursor-pointer overflow-hidden rounded-lg bg-gradient-to-br'
              >
                <div className='flex h-full w-full items-center justify-center transition-transform duration-300 group-hover:scale-110'>
                  <span className='text-4xl font-bold text-white/50'>#{i}</span>
                </div>
              </div>
            ))}
          </div>

          <div className='mt-8 text-center'>
            <Button variant='outline' size='lg'>
              Alle Bilder ansehen
            </Button>
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className='from-fanini-red-500 to-fanini-red-600 bg-gradient-to-r py-20 text-white'>
        <Container>
          <div className='mx-auto max-w-3xl text-center'>
            <h2 className='font-heading mb-4 text-4xl font-bold'>Werde Teil der Familie!</h2>
            <p className='mb-8 text-xl text-white/90'>
              Unterstütze Eintracht Spandau gemeinsam mit über 150 anderen Fans. Sei dabei bei
              Events, Auswärtsfahrten und exklusiven Vereinsaktionen.
            </p>
            <div className='flex flex-wrap justify-center gap-4'>
              <Button
                size='lg'
                variant='secondary'
                className='text-fanini-red-600 bg-white hover:bg-gray-100'
              >
                Mitglied werden
              </Button>
              <Button
                size='lg'
                variant='outline'
                className='border-white text-white hover:bg-white/10'
              >
                Mehr erfahren
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </PublicLayout>
  );
}

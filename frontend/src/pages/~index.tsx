import { createFileRoute } from '@tanstack/react-router';
import { Button, Card, CardContent } from '@/shared/shadcn';
import { Image } from '@/shared/ui/Image';
import { Gallery } from '@/widgets/Gallery';

// Bilder aus shared assets
import leidenschaftImage from '@/shared/assets/images/leidenschaft-aus-tradition.png';
import gruendungsschildImage from '@/shared/assets/images/gruendungsschild.jpg';
import knabeRausImage from '@/shared/assets/images/knabe-raus.jpg';

export const Route = createFileRoute('/')({
  component: HomePage,
});

function HomePage() {
  return (
    <div className='min-h-screen'>
      {/* Hero Section mit Logo */}
      <section
        className='relative overflow-hidden py-20 text-[var(--color-primary-foreground)] lg:py-32'
        style={{ backgroundColor: 'var(--color-fanini-blue)' }}
      >
        <div className='absolute inset-0 bg-black/20' />
        <div
          className='absolute -right-32 -bottom-32 h-96 w-96 rounded-full opacity-20 blur-3xl'
          style={{ backgroundColor: 'var(--color-fanini-red)' }}
        />

        <div className='relative container mx-auto px-4'>
          <div className='grid items-center gap-12 lg:grid-cols-2'>
            <div className='space-y-6'>
              <h1 className='font-[Bebas_Neue] text-5xl font-bold lg:text-7xl'>
                FANINITIATIVE <span className='block text-[#f5a8a5]'>SPANDAU</span>
              </h1>
              <p className='text-xl font-light opacity-90 lg:text-2xl'>
                Der offizielle Fanverein der Eintracht Spandau - gemeinsam stark seit 2022
              </p>
              <div className='flex flex-wrap gap-4'>
                <Button
                  asChild
                  size='lg'
                  className='bg-[var(--color-fanini-red)] text-white hover:bg-[#a7453d]'
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

            {/* Logo/Hero Bild */}
            <div className='relative'>
              <div className='mx-auto aspect-square max-w-md'>
                <Image
                  src='/images/logo.png'
                  alt='Faninitiative Spandau Logo'
                  className='h-full w-full object-contain drop-shadow-2xl'
                  fallback={leidenschaftImage}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vereinsphilosophie Section mit Bild */}
      <section className='py-20'>
        <div className='container mx-auto px-4'>
          <div className='grid items-center gap-12 lg:grid-cols-2'>
            <div className='relative'>
              <Image
                src={leidenschaftImage}
                alt='Leidenschaft aus Tradition'
                className='w-full rounded-lg shadow-xl'
              />
            </div>
            <div className='space-y-6'>
              <h2 className='font-[Bebas_Neue] text-4xl font-bold text-[var(--color-fanini-blue)]'>
                Leidenschaft aus Tradition
              </h2>
              <p className='text-lg text-[var(--color-muted-foreground)]'>
                Seit unserer Gründung 2025 vereinen wir Fans der Eintracht Spandau unter einem Dach.
                Gemeinsam schaffen wir unvergessliche Momente und unterstützen unseren Verein mit
                voller Leidenschaft.
              </p>
              <div className='flex items-center gap-4'>
                <Image
                  src={gruendungsschildImage}
                  alt='Gründungsschild'
                  className='h-24 w-auto rounded'
                />
                <div>
                  <p className='font-semibold'>Gegründet 2025</p>
                  <p className='text-sm text-[var(--color-muted-foreground)]'>
                    Offizieller Fanverein
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className='bg-[var(--color-muted)] py-12'>
        <div className='container mx-auto px-4'>
          <div className='grid grid-cols-2 gap-8 text-center md:grid-cols-4'>
            {[
              { value: '70+', label: 'Aktive Mitglieder' },
              { value: '24', label: 'Events pro Jahr' },
              { value: '2025', label: 'Gegründet' },
              { value: '100%', label: 'Leidenschaft' },
            ].map((stat, i) => (
              <div key={i}>
                <div className='text-4xl font-bold text-[var(--color-fanini-blue)]'>
                  {stat.value}
                </div>
                <div className='mt-1 text-sm text-[var(--color-muted-foreground)]'>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section id='events' className='py-20'>
        <div className='container mx-auto px-4'>
          <div className='mb-12 text-center'>
            <h2 className='mb-4 font-[Bebas_Neue] text-4xl font-bold text-[var(--color-fanini-blue)]'>
              Kommende Events
            </h2>
            <p className='mx-auto max-w-2xl text-lg text-[var(--color-muted-foreground)]'>
              Sei dabei wenn wir gemeinsam unsere Eintracht unterstützen
            </p>
          </div>

          <div className='grid gap-8 md:grid-cols-2 lg:grid-cols-3'>
            {[
              {
                date: '28',
                month: 'Januar',
                title: 'Rückrundenstart-Party',
                desc: 'Gemeinsam in die zweite Saisonhälfte! Mit Live-Musik und Überraschungsgästen.',
                color: 'var(--color-fanini-red)',
              },
              {
                date: '14',
                month: 'Februar',
                title: 'Auswärtsfahrt Berlin',
                desc: 'Zusammen zum Derby! Busfahrt, Stadionbesuch und After-Match-Party inklusive.',
                color: 'var(--color-fanini-blue)',
              },
              {
                date: '??',
                month: 'Bald',
                title: 'Überraschungsevent',
                desc: 'Etwas Großes ist in Planung! Haltet die Augen offen für weitere Infos.',
                color: 'var(--color-muted-foreground)',
              },
            ].map((event, i) => (
              <Card key={i} className='overflow-hidden transition-all duration-300 hover:shadow-lg'>
                <div
                  className='relative aspect-video overflow-hidden'
                  style={{ backgroundColor: event.color }}
                >
                  <div className='absolute inset-0 bg-black/30' />
                  <div className='absolute bottom-4 left-4 text-white'>
                    <div className='text-3xl font-bold'>{event.date}</div>
                    <div className='text-sm uppercase'>{event.month}</div>
                  </div>
                </div>
                <CardContent className='p-6'>
                  <h3 className='mb-2 text-xl font-semibold'>{event.title}</h3>
                  <p className='mb-4 text-[var(--color-muted-foreground)]'>{event.desc}</p>
                  <Button variant='ghost' className='text-[var(--color-fanini-blue)]'>
                    Mehr erfahren →
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className='bg-[var(--color-muted)] py-20'>
        <div className='container mx-auto px-4'>
          <div className='mb-12 text-center'>
            <h2 className='mb-4 font-[Bebas_Neue] text-4xl font-bold text-[var(--color-fanini-blue)]'>
              Unsere Community
            </h2>
            <p className='mx-auto max-w-2xl text-lg text-[var(--color-muted-foreground)]'>
              Eindrücke aus dem Vereinsleben - von Fans für Fans
            </p>
          </div>

          <Gallery
            images={[
              { src: knabeRausImage, alt: 'Knabe raus!' },
              { src: gruendungsschildImage, alt: 'Gründungsschild' },
              { src: leidenschaftImage, alt: 'Leidenschaft aus Tradition' },
            ]}
          />
        </div>
      </section>

      {/* CTA Section */}
      <section className='py-20 text-white' style={{ backgroundColor: 'var(--color-fanini-red)' }}>
        <div className='container mx-auto px-4'>
          <div className='mx-auto max-w-3xl text-center'>
            <h2 className='mb-4 font-[Bebas_Neue] text-4xl font-bold'>Werde Teil der Familie!</h2>
            <p className='mb-8 text-xl opacity-90'>
              Unterstütze Eintracht Spandau gemeinsam mit über 70 anderen Fans.
            </p>
            <div className='flex flex-wrap justify-center gap-4'>
              <Button
                size='lg'
                className='bg-white text-[var(--color-fanini-red)] hover:bg-gray-100'
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
        </div>
      </section>
    </div>
  );
}

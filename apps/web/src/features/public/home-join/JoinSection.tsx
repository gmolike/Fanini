// frontend/src/features/public/home-join/JoinSection.tsx
import { motion } from 'framer-motion';
import { ArrowRight, Heart, Shield, Star, Users } from 'lucide-react';

import { Button } from '@/shared/shadcn';
import { AnimatedValue, FloatingCard, GlassCard } from '@/shared/ui';

/**
 * Join Section für die Homepage
 * @description Call-to-Action für neue Mitglieder
 */
export const JoinSection = () => {
  const benefits = [
    {
      icon: Users,
      title: 'Exklusive Events',
      description: 'Nimm an besonderen Veranstaltungen nur für Mitglieder teil',
    },
    {
      icon: Heart,
      title: 'Community',
      description: 'Werde Teil einer leidenschaftlichen Fangemeinschaft',
    },
    {
      icon: Star,
      title: 'Mitbestimmung',
      description: 'Gestalte die Zukunft der Faninitiative aktiv mit',
    },
    {
      icon: Shield,
      title: 'Unterstützung',
      description: 'Unterstütze Eintracht Spandau gemeinsam mit uns',
    },
  ];

  return (
    <section className="relative overflow-hidden py-20">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `repeating-linear-gradient(
              45deg,
              var(--color-fanini-blue) 0,
              var(--color-fanini-blue) 1px,
              transparent 1px,
              transparent 15px
            )`,
          }}
        />
      </div>

      <div className="relative z-10 container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <AnimatedValue gradient>
            <h2 className="mb-4 pb-3 text-4xl font-bold md:text-5xl">
              Werde Mitglied der Faninitiative
            </h2>
          </AnimatedValue>
          <p className="mx-auto max-w-2xl text-xl text-[var(--color-muted-foreground)]">
            Gemeinsam sind wir stark. Werde Teil der offiziellen Faninitiative und unterstütze
            Eintracht Spandau auf eine neue Art.
          </p>
        </motion.div>

        {/* Benefits Grid */}
        <div className="mb-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <FloatingCard>
                  <GlassCard className="h-full p-6 transition-transform hover:scale-105">
                    <div className="mb-4 w-fit rounded-full bg-gradient-to-br from-[var(--color-fanini-blue)] to-[var(--color-fanini-red)] p-3">
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="mb-2 text-lg font-semibold">{benefit.title}</h3>
                    <p className="text-sm text-[var(--color-muted-foreground)]">
                      {benefit.description}
                    </p>
                  </GlassCard>
                </FloatingCard>
              </motion.div>
            );
          })}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Button
            size="lg"
            className="transform bg-gradient-to-r from-[var(--color-fanini-blue)] to-[var(--color-fanini-red)] text-white shadow-xl transition-all hover:scale-105 hover:shadow-2xl"
            asChild
          >
            <a
              href="https://easyverein.com/public/Fanini/applicationform/12733"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3"
            >
              <Heart className="h-5 w-5" />
              Jetzt Mitglied werden
              <ArrowRight className="h-5 w-5" />
            </a>
          </Button>
          <p className="mt-4 text-sm text-[var(--color-muted-foreground)]">
            Werde Teil von etwas Großem - die Anmeldung dauert nur wenige Minuten
          </p>
        </motion.div>
      </div>
    </section>
  );
};

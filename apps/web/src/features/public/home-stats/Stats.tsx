// frontend/src/features/public/home-stats/Stats.tsx
import { motion } from 'framer-motion';
import { Calendar, Heart, Trophy, Users } from 'lucide-react';

import { usePublicStats } from '@/entities/public/stats';

import { Container, GlassCard, LoadingState, ParallaxCard } from '@/shared/ui';

/**
 * Stats Section für die Homepage
 * @description Zeigt animierte Vereinsstatistiken
 */
export const Stats = () => {
  const statsQuery = usePublicStats();

  return (
    <section className="relative py-20">
      <Container>
        <LoadingState
          query={statsQuery}
          loadingFallback={<StatsLoadingSkeleton />}
          errorFallback={<StatsError />}
        >
          {response => {
            const stats = [
              {
                icon: Users,
                value: `${String(response.data.memberCount)}+`,
                label: 'Aktive Mitglieder',
                gradient: 'from-blue-500 to-purple-500',
              },
              {
                icon: Calendar,
                value: response.data.eventsPerYear.toString(),
                label: 'Events pro Jahr',
                gradient: 'from-purple-500 to-pink-500',
              },
              {
                icon: Trophy,
                value: response.data.foundedYear.toString(),
                label: 'Gegründet',
                gradient: 'from-pink-500 to-red-500',
              },
              {
                icon: Heart,
                value: `${String(response.data.passionPercentage)}%`,
                label: 'Leidenschaft',
                gradient: 'from-red-500 to-orange-500',
              },
            ];

            return (
              <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
                {stats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 50 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <ParallaxCard>
                        <GlassCard className="group p-8 text-center transition-transform hover:scale-105">
                          <motion.div
                            whileHover={{ rotate: 360 }}
                            transition={{ duration: 0.5 }}
                            className={`inline-flex rounded-full bg-gradient-to-br ${stat.gradient} mb-4 p-4`}
                          >
                            <Icon className="h-8 w-8 text-white" />
                          </motion.div>
                          <motion.div
                            initial={{ scale: 0 }}
                            whileInView={{ scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ type: 'spring', delay: 0.2 + index * 0.1 }}
                            className="mb-2 bg-gradient-to-r from-[var(--color-fanini-blue)] to-[var(--color-fanini-red)] bg-clip-text text-4xl font-bold text-transparent"
                          >
                            {stat.value}
                          </motion.div>
                          <div className="font-medium text-[var(--color-muted-foreground)]">
                            {stat.label}
                          </div>
                        </GlassCard>
                      </ParallaxCard>
                    </motion.div>
                  );
                })}
              </div>
            );
          }}
        </LoadingState>
      </Container>
    </section>
  );
};

const StatsLoadingSkeleton = () => (
  <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
    {[1, 2, 3, 4].map(i => (
      <GlassCard key={i} className="p-8">
        <div className="animate-pulse">
          <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-gray-300" />
          <div className="mx-auto mb-2 h-10 w-20 rounded bg-gray-300" />
          <div className="mx-auto h-4 w-24 rounded bg-gray-300" />
        </div>
      </GlassCard>
    ))}
  </div>
);

const StatsError = () => (
  <GlassCard className="p-12 text-center">
    <p className="text-[var(--color-muted-foreground)]">
      Statistiken konnten nicht geladen werden.
    </p>
  </GlassCard>
);

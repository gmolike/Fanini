// frontend/src/widgets/public/home/Stats/Stats.tsx
import { Calendar, Heart,Trophy, Users } from 'lucide-react';

import { usePublicStats } from '@/entities/public/stats';

import { LoadingState } from '@/shared/ui/feedback/ui/LoadingState';
import { Container } from '@/shared/ui/layout/Container';

/**
 * Stats Widget
 * @description Zeigt wichtige Vereinsstatistiken von der API
 */
export const Stats = () => {
  const statsQuery = usePublicStats();

  return (
    <section className="relative bg-[var(--color-muted)] py-16">
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: 'url(/images/Leidenschaft-aus-Tradition.png)',
          backgroundPosition: 'center',
          backgroundSize: 'cover',
        }}
      />

      <Container className="relative">
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
                color: 'text-[var(--color-fanini-blue)]',
              },
              {
                icon: Calendar,
                value: response.data.eventsPerYear.toString(),
                label: 'Events pro Jahr',
                color: 'text-[var(--color-fanini-red)]',
              },
              {
                icon: Trophy,
                value: response.data.foundedYear.toString(),
                label: 'Gegründet',
                color: 'text-[var(--color-fanini-blue)]',
              },
              {
                icon: Heart,
                value: `${String(response.data.passionPercentage)}%`,
                label: 'Leidenschaft',
                color: 'text-[var(--color-fanini-red)]',
              },
            ];

            return (
              <div className="grid grid-cols-2 gap-8 sm:gap-12 lg:grid-cols-4">
                {stats.map(stat => {
                  const Icon = stat.icon;
                  return (
                    <div key={stat.label} className="text-center">
                      <Icon className={`mx-auto mb-4 h-10 w-10 ${stat.color}`} />
                      <div className="text-3xl font-bold sm:text-4xl">{stat.value}</div>
                      <div className="mt-2 text-sm font-medium text-[var(--color-muted-foreground)]">
                        {stat.label}
                      </div>
                    </div>
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

// Loading Skeleton
const StatsLoadingSkeleton = () => (
  <div className="grid grid-cols-2 gap-8 sm:gap-12 lg:grid-cols-4">
    {[1, 2, 3, 4].map(i => (
      <div key={i} className="text-center">
        <div className="mx-auto mb-4 h-10 w-10 animate-pulse rounded-full bg-gray-300" />
        <div className="mx-auto mb-2 h-8 w-20 animate-pulse rounded bg-gray-300" />
        <div className="mx-auto h-4 w-24 animate-pulse rounded bg-gray-300" />
      </div>
    ))}
  </div>
);

// Error Component
const StatsError = () => (
  <div className="py-8 text-center">
    <p className="text-[var(--color-muted-foreground)]">
      Statistiken konnten nicht geladen werden.
    </p>
  </div>
);

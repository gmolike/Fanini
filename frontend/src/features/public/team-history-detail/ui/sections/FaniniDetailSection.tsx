// frontend/src/features/public/team-history-detail/ui/sections/FaniniDetailSection.tsx
import { motion } from 'framer-motion';
import { Calendar, Heart, Image as ImageIcon, Users } from 'lucide-react';

import type { FaniniContent, TeamHistoryEntry } from '@/entities/public/team-history';

import { Badge } from '@/shared/shadcn';
import { AnimatedValue, GlassCard, HoverCard, Image, ParallaxCard } from '@/shared/ui';

type FaniniDetailSectionProps = {
  team: TeamHistoryEntry;
  year: number;
};

export const FaniniDetailSection = ({ team, year }: FaniniDetailSectionProps) => {
  const content = team.content as FaniniContent;

  return (
    <div className="space-y-8">
      {/* Overview Hero */}
      <ParallaxCard>
        <GlassCard className="relative overflow-hidden p-8 md:p-12">
          <div className="absolute inset-0">
            <div className="absolute -top-20 -right-20 h-40 w-40 animate-pulse rounded-full bg-red-500/10 blur-3xl" />
            <div className="absolute -bottom-20 -left-20 h-40 w-40 animate-pulse rounded-full bg-orange-500/10 blur-3xl delay-1000" />
          </div>

          <div className="relative z-10 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring' }}
              className="mb-6 inline-flex rounded-full bg-gradient-to-r from-red-500 to-orange-500 p-5"
            >
              <Heart className="h-12 w-12 text-white" />
            </motion.div>

            <h2 className="mb-4 text-3xl font-bold">
              {content.title || `Faninitiative ${String(year)}`}
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-[var(--color-muted-foreground)]">
              {content.description}
            </p>

            {content.members > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-6 inline-flex items-center gap-3 rounded-full bg-white/10 px-6 py-3 backdrop-blur-sm"
              >
                <Users className="h-5 w-5" />
                <span className="text-xl font-bold">
                  <AnimatedValue value={content.members} /> aktive Mitglieder
                </span>
              </motion.div>
            )}
          </div>
        </GlassCard>
      </ParallaxCard>

      {/* Activities Timeline */}
      {content.activities.length > 0 && (
        <GlassCard className="p-8">
          <h2 className="mb-8 flex items-center gap-3 text-2xl font-bold">
            <Calendar className="h-6 w-6 text-[var(--color-fanini-red)]" />
            Aktivitäten {year}
          </h2>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute top-0 bottom-0 left-6 w-0.5 bg-gradient-to-b from-[var(--color-fanini-red)] to-[var(--color-fanini-blue)]" />

            <div className="space-y-8">
              {content.activities.map((activity, index) => (
                <motion.div
                  key={`${activity.name}-${activity.date}`}
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative pl-16"
                >
                  {/* Timeline Dot */}
                  <div className="ring-background absolute top-2 left-4 h-4 w-4 rounded-full bg-[var(--color-fanini-red)] ring-4" />

                  <HoverCard>
                    <div className="rounded-xl border p-6">
                      <div className="mb-3 flex items-start justify-between">
                        <h3 className="text-lg font-bold">{activity.name}</h3>
                        <Badge variant="outline">{activity.date}</Badge>
                      </div>

                      <p className="mb-4 text-[var(--color-muted-foreground)]">
                        {activity.description}
                      </p>

                      {activity.participants || activity.images ? (
                        <div className="flex items-center gap-6 text-sm">
                          {activity.participants ? (
                            <span className="flex items-center gap-2">
                              <Users className="h-4 w-4" />
                              <AnimatedValue value={activity.participants} /> Teilnehmer
                            </span>
                          ) : null}
                          {activity.images && activity.images.length > 0 ? (
                            <span className="flex items-center gap-2 text-[var(--color-fanini-blue)]">
                              <ImageIcon className="h-4 w-4" />
                              {activity.images.length} Fotos
                            </span>
                          ) : null}
                        </div>
                      ) : null}
                    </div>
                  </HoverCard>
                </motion.div>
              ))}
            </div>
          </div>
        </GlassCard>
      )}

      {/* Images Gallery */}
      {content.images && content.images.length > 0 ? (
        <GlassCard className="p-8">
          <h2 className="mb-6 flex items-center gap-3 text-2xl font-bold">
            <ImageIcon className="h-6 w-6" />
            Impressionen aus {year}
          </h2>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {content.images.map((image, index) => (
              <motion.div
                key={image}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className="group relative aspect-square overflow-hidden rounded-xl"
              >
                <Image
                  src={image}
                  alt={`Faninitiative ${year.toString()} - Bild ${String(index + 1)}`}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              </motion.div>
            ))}
          </div>
        </GlassCard>
      ) : null}
    </div>
  );
};

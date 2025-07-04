// frontend/src/features/public/team-history-detail/ui/sections/FernDetailSection.tsx
import { motion } from 'framer-motion';
import { Globe, Mail, MapPin, Users } from 'lucide-react';

import type { FernContent, TeamHistoryEntry } from '@/entities/public/team-history';

import { Badge } from '@/shared/shadcn';
import { AnimatedNumber, GlassCard, HoverCard, ParallaxCard } from '@/shared/ui';

type FernDetailSectionProps = {
  team: TeamHistoryEntry;
  year: number;
};
export const FernDetailSection = ({ team, year }: FernDetailSectionProps) => {
  const content = team.content as FernContent;
  const totalMembers = content.chapters.reduce((sum, chapter) => sum + chapter.memberCount, 0);

  return (
    <div className="space-y-8">
      {/* Overview Hero */}
      <ParallaxCard>
        <GlassCard className="relative overflow-hidden p-8 md:p-12">
          <div className="absolute inset-0">
            <div className="absolute -top-20 -right-20 h-40 w-40 animate-pulse rounded-full bg-blue-500/10 blur-3xl" />
            <div className="absolute -bottom-20 -left-20 h-40 w-40 animate-pulse rounded-full bg-cyan-500/10 blur-3xl delay-1000" />
          </div>

          <div className="relative z-10 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring' }}
              className="mb-6 inline-flex rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 p-5"
            >
              <Globe className="h-12 w-12 text-white" />
            </motion.div>

            <h2 className="mb-4 text-3xl font-bold">
              {content.title || `Ferninitiative ${String(year)}`}
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-[var(--color-muted-foreground)]">
              {content.description}
            </p>

            <div className="mt-6 flex justify-center gap-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-center"
              >
                <div className="text-3xl font-bold">
                  <AnimatedNumber value={totalMembers} />
                </div>
                <p className="text-sm text-[var(--color-muted-foreground)]">Mitglieder weltweit</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-center"
              >
                <div className="text-3xl font-bold">
                  <AnimatedNumber value={content.chapters.length} />
                </div>
                <p className="text-sm text-[var(--color-muted-foreground)]">Chapter</p>
              </motion.div>
            </div>
          </div>
        </GlassCard>
      </ParallaxCard>

      {/* World Map (Optional - Placeholder) */}
      <GlassCard className="p-8">
        <h2 className="mb-6 flex items-center gap-3 text-2xl font-bold">
          <MapPin className="h-6 w-6 text-[var(--color-fanini-blue)]" />
          Chapter Weltweit
        </h2>

        <div className="mb-8 aspect-video rounded-xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 p-8">
          <div className="flex h-full items-center justify-center">
            <p className="text-[var(--color-muted-foreground)]">
              Interaktive Weltkarte (Coming Soon)
            </p>
          </div>
        </div>

        {/* Chapter Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {content.chapters.map((chapter, index) => (
            <motion.div
              key={chapter.location}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
            >
              <HoverCard>
                <div className="rounded-xl border p-6">
                  <div className="mb-4 flex items-start justify-between">
                    <div>
                      <h3 className="flex items-center gap-2 text-lg font-bold">
                        <MapPin className="h-4 w-4" />
                        {chapter.location}
                      </h3>
                      {chapter.country ? (
                        <p className="text-sm text-[var(--color-muted-foreground)]">
                          {chapter.country}
                        </p>
                      ) : null}
                    </div>
                    <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
                      <AnimatedNumber value={chapter.memberCount} />
                    </Badge>
                  </div>

                  {chapter.foundedDate ? (
                    <p className="mb-3 text-sm text-[var(--color-muted-foreground)]">
                      Gegründet: {chapter.foundedDate}
                    </p>
                  ) : null}

                  {chapter.contact ? (
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4" />
                      <a
                        href={`mailto:${chapter.contact}`}
                        className="text-[var(--color-fanini-blue)] hover:underline"
                      >
                        {chapter.contact}
                      </a>
                    </div>
                  ) : null}
                </div>
              </HoverCard>
            </motion.div>
          ))}
        </div>
      </GlassCard>

      {/* Activities */}
      {content.activities.length > 0 && (
        <GlassCard className="p-8">
          <h2 className="mb-6 flex items-center gap-3 text-2xl font-bold">
            <Users className="h-6 w-6" />
            Gemeinsame Aktivitäten
          </h2>

          <div className="grid gap-4 md:grid-cols-2">
            {content.activities.map((activity, index) => (
              <motion.div
                key={activity}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-3"
              >
                <div className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500" />
                <p className="text-[var(--color-muted-foreground)]">{activity}</p>
              </motion.div>
            ))}
          </div>
        </GlassCard>
      )}
    </div>
  );
};

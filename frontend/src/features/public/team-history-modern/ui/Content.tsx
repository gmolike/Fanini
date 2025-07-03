// frontend/src/features/public/team-history-modern/ui/Content.tsx
import { motion } from 'framer-motion';
import { Gamepad2, Globe, Heart, Trophy, Users } from 'lucide-react';

import { TeamContentPreview } from '@/features/public/team-history-modern';

import type { TeamHistoryYearResponse } from '@/entities/public/team-history';

import { GlassCard, HoverCard, ParallaxCard } from '@/shared/ui';

const TEAM_CONFIGS = {
  lol: {
    icon: Gamepad2,
    gradient: 'from-purple-500 to-pink-500',
    title: 'League of Legends',
  },
  baller: {
    icon: Users,
    gradient: 'from-green-500 to-blue-500',
    title: 'Baller Liga',
  },
  fanini: {
    icon: Heart,
    gradient: 'from-red-500 to-orange-500',
    title: 'Faninitiative',
  },
  fern: {
    icon: Globe,
    gradient: 'from-blue-500 to-cyan-500',
    title: 'Ferninitiative',
  },
} as const;

type TeamHistoryContentProps = {
  data: TeamHistoryYearResponse;
};

export const TeamHistoryContent = ({ data }: TeamHistoryContentProps) => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="space-y-12">
      {/* Year Comment Hero */}
      <ParallaxCard>
        <GlassCard className="p-8 md:p-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="mb-4 bg-gradient-to-r from-[var(--color-fanini-blue)] to-[var(--color-fanini-red)] bg-clip-text text-3xl font-bold text-transparent md:text-4xl">
              {data.faniniComment.headline}
            </h2>
            <p className="text-lg leading-relaxed text-[var(--color-muted-foreground)]">
              {data.faniniComment.content}
            </p>
          </motion.div>
        </GlassCard>
      </ParallaxCard>

      {/* Teams Grid */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 gap-6 md:grid-cols-2"
      >
        {data.teams.map(team => {
          const config = TEAM_CONFIGS[team.teamType as keyof typeof TEAM_CONFIGS];
          const Icon = config.icon;

          return (
            <motion.div key={team.id} variants={item}>
              <HoverCard>
                <GlassCard className="h-full overflow-hidden">
                  <div className={`h-2 bg-gradient-to-r ${config.gradient}`} />
                  <div className="p-6">
                    <div className="mb-4 flex items-center gap-3">
                      <div
                        className={`rounded-xl bg-gradient-to-r p-3 ${config.gradient} text-white`}
                      >
                        <Icon className="h-6 w-6" />
                      </div>
                      <h3 className="text-xl font-bold">{config.title}</h3>
                    </div>
                    <TeamContentPreview content={team.content} type={team.teamType} />
                  </div>
                </GlassCard>
              </HoverCard>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Special Events */}
      {data.specialEvents.length > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
          <h3 className="mb-6 text-center text-2xl font-bold">
            <Trophy className="mr-2 inline h-6 w-6 text-yellow-500" />
            Besondere Momente
          </h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {data.specialEvents.map(event => (
              <GlassCard key={event.id} className="p-4 transition-transform hover:scale-105">
                <h4 className="mb-2 font-bold">{event.title}</h4>
                <p className="text-sm text-[var(--color-muted-foreground)]">{event.description}</p>
              </GlassCard>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

import { motion } from 'framer-motion';
import { Calendar, Trophy, Users } from 'lucide-react';

import type { LolContent, TeamHistoryEntry } from '@/entities/public/team-history';

import { Badge } from '@/shared/shadcn';
import { GlassCard, HoverCard, ParallaxCard } from '@/shared/ui';

type LolDetailSectionProps = {
  team: TeamHistoryEntry;
  year: number;
};

export const LolDetailSection = ({ team, year }: LolDetailSectionProps) => {
  const content = team.content as LolContent;
  const roleOrder = ['Top', 'Jungle', 'Mid', 'Bot', 'Support'] as const;
  const sortedRoster = [...content.roster].sort(
    (a, b) => roleOrder.indexOf(a.role) - roleOrder.indexOf(b.role)
  );

  return (
    <div className="space-y-8">
      {/* Roster Section */}
      <ParallaxCard>
        <GlassCard className="p-8">
          <h2 className="mb-6 flex items-center gap-3 text-2xl font-bold">
            <Users className="h-6 w-6 text-[var(--color-fanini-blue)]" />
            Team Roster {year} {/* Year wird hier verwendet */}
          </h2>
          <div className="grid gap-4">
            {sortedRoster.map((player, index) => (
              <motion.div
                key={player.ign}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <HoverCard>
                  <div className="flex items-center justify-between rounded-xl bg-gradient-to-r from-white/5 to-white/10 p-4 backdrop-blur-sm">
                    <div className="flex items-center gap-4">
                      <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                        {player.role}
                      </Badge>
                      <div>
                        <p className="text-lg font-bold">{player.ign}</p>
                        {player.realName ? (
                          <p className="text-sm text-[var(--color-muted-foreground)]">
                            {player.realName}
                          </p>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </HoverCard>
              </motion.div>
            ))}
          </div>
        </GlassCard>
      </ParallaxCard>

      {/* Seasons & Achievements */}
      <div className="grid gap-8 md:grid-cols-2">
        {/* Seasons */}
        <GlassCard className="p-6">
          <h3 className="mb-4 flex items-center gap-2 text-xl font-bold">
            <Calendar className="h-5 w-5" />
            Seasons
          </h3>
          <div className="space-y-4">
            {content.seasons.map(season => (
              <div key={season.name} className="rounded-lg border p-4">
                <div className="mb-2 flex items-center justify-between">
                  <h4 className="font-semibold">{season.name}</h4>
                  <Badge variant="outline">#{season.placement}</Badge>
                </div>
                <p className="text-sm text-[var(--color-muted-foreground)]">
                  {season.wins}W - {season.losses}L
                </p>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Achievements */}
        <GlassCard className="p-6">
          <h3 className="mb-4 flex items-center gap-2 text-xl font-bold">
            <Trophy className="h-5 w-5" />
            Erfolge
          </h3>
          <div className="space-y-3">
            {content.achievements.map(achievement => (
              <div key={achievement.title} className="flex gap-3">
                <Trophy className="mt-1 h-5 w-5 flex-shrink-0 text-yellow-500" />
                <div>
                  <p className="font-medium">{achievement.title}</p>
                  {achievement.description ? (
                    <p className="text-sm text-[var(--color-muted-foreground)]">
                      {achievement.description}
                    </p>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

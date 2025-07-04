import { motion } from 'framer-motion';
import { Award, Target, TrendingUp, Trophy, Users } from 'lucide-react';

import type { BallerContent, TeamHistoryEntry } from '@/entities/public/team-history';

import { Badge } from '@/shared/shadcn';
import { AnimatedNumber, GlassCard, HoverCard, ParallaxCard } from '@/shared/ui';

type BallerDetailSectionProps = {
  team: TeamHistoryEntry;
  year: number;
};

type Position = 'TW' | 'IV' | 'LV' | 'RV' | 'ZM' | 'LM' | 'RM' | 'ST';

const POSITION_GROUPS = {
  defense: ['TW', 'IV', 'LV', 'RV'] as Position[],
  midfield: ['ZM', 'LM', 'RM'] as Position[],
  attack: ['ST'] as Position[],
} as const;

const POSITION_LABELS = {
  defense: 'Abwehr',
  midfield: 'Mittelfeld',
  attack: 'Angriff',
} as const;

export const BallerDetailSection = ({ team, year }: BallerDetailSectionProps) => {
  const content = team.content as BallerContent;

  const groupedSquad = {
    defense: content.squad.filter(p => POSITION_GROUPS.defense.includes(p.position as Position)),
    midfield: content.squad.filter(p => POSITION_GROUPS.midfield.includes(p.position as Position)),
    attack: content.squad.filter(p => POSITION_GROUPS.attack.includes(p.position as Position)),
  };

  return (
    <div className="space-y-8">
      {/* Season Stats Hero */}
      <ParallaxCard>
        <GlassCard className="p-8">
          <h2 className="mb-6 text-center text-2xl font-bold">Saison {year} Statistiken</h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.1 }}
              className="rounded-xl bg-gradient-to-br from-green-500/20 to-blue-500/20 p-6 text-center"
            >
              <div className="text-3xl font-bold">
                <AnimatedNumber value={content.seasonStats.position} />
                <span className="text-lg">.</span>
              </div>
              <p className="text-sm text-[var(--color-muted-foreground)]">Tabellenplatz</p>
            </motion.div>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.2 }}
              className="rounded-xl bg-gradient-to-br from-green-500/20 to-blue-500/20 p-6 text-center"
            >
              <div className="text-3xl font-bold">
                <AnimatedNumber value={content.seasonStats.points} />
              </div>
              <p className="text-sm text-[var(--color-muted-foreground)]">Punkte</p>
            </motion.div>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.3 }}
              className="rounded-xl bg-gradient-to-br from-green-500/20 to-blue-500/20 p-6 text-center"
            >
              <div className="text-2xl font-bold">
                {content.seasonStats.goalsFor}:{content.seasonStats.goalsAgainst}
              </div>
              <p className="text-sm text-[var(--color-muted-foreground)]">Torverhältnis</p>
            </motion.div>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.4 }}
              className="rounded-xl bg-gradient-to-br from-green-500/20 to-blue-500/20 p-6 text-center"
            >
              <div className="text-lg font-bold">
                {content.seasonStats.won}S {content.seasonStats.drawn}U {content.seasonStats.lost}N
              </div>
              <p className="text-sm text-[var(--color-muted-foreground)]">Bilanz</p>
            </motion.div>
          </div>
        </GlassCard>
      </ParallaxCard>

      {/* Squad */}
      <GlassCard className="p-8">
        <h2 className="mb-6 flex items-center gap-3 text-2xl font-bold">
          <Users className="h-6 w-6 text-[var(--color-fanini-blue)]" />
          Mannschaftskader
        </h2>

        {Object.entries(groupedSquad).map(([group, players]) => {
          if (players.length === 0) return null;

          return (
            <div key={group} className="mb-8">
              <h3 className="mb-4 text-lg font-semibold text-[var(--color-muted-foreground)]">
                {POSITION_LABELS[group as keyof typeof POSITION_LABELS]}
              </h3>
              <div className="grid gap-3">
                {players.map((player, index) => (
                  <motion.div
                    key={player.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <HoverCard>
                      <div className="rounded-xl bg-gradient-to-r from-white/5 to-white/10 p-4 backdrop-blur-sm">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            {player.jerseyNumber ? (
                              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-fanini-blue)] text-xl font-bold text-white">
                                {player.jerseyNumber}
                              </div>
                            ) : null}
                            <div>
                              <p className="text-lg font-bold">{player.name}</p>
                              <Badge variant="outline" className="mt-1">
                                {player.position}
                              </Badge>
                            </div>
                          </div>
                          {player.goals || player.assists || player.appearances ? (
                            <div className="flex items-center gap-4 text-sm">
                              {player.appearances ? (
                                <span className="text-[var(--color-muted-foreground)]">
                                  {player.appearances} Spiele
                                </span>
                              ) : null}
                              {player.goals || player.assists ? (
                                <div className="flex items-center gap-3">
                                  {player.goals ? (
                                    <span className="flex items-center gap-1">
                                      <Target className="h-4 w-4" />
                                      {player.goals}
                                    </span>
                                  ) : null}
                                  {player.assists ? (
                                    <span className="flex items-center gap-1">
                                      <TrendingUp className="h-4 w-4" />
                                      {player.assists}
                                    </span>
                                  ) : null}
                                </div>
                              ) : null}
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </HoverCard>
                  </motion.div>
                ))}
              </div>
            </div>
          );
        })}
      </GlassCard>

      {/* Match Highlights */}
      {content.highlights.length > 0 && (
        <GlassCard className="p-8">
          <h2 className="mb-6 flex items-center gap-3 text-2xl font-bold">
            <Trophy className="h-6 w-6 text-[var(--color-fanini-red)]" />
            Spiel-Highlights
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {content.highlights.map((match, index) => (
              <motion.div
                key={`${match.date}-${match.opponent}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <HoverCard>
                  <div className="rounded-xl border p-6">
                    <div className="mb-3 flex items-start justify-between">
                      <h4 className="text-lg font-semibold">{match.opponent}</h4>
                      <Badge className="bg-gradient-to-r from-green-500 to-blue-500 text-white">
                        {match.result}
                      </Badge>
                    </div>
                    <p className="mb-2 text-sm text-[var(--color-muted-foreground)]">
                      {match.date}
                    </p>
                    <p className="text-sm">{match.description}</p>
                  </div>
                </HoverCard>
              </motion.div>
            ))}
          </div>
        </GlassCard>
      )}

      {/* Final Table */}
      {content.finalTable.length > 0 && (
        <GlassCard className="p-8">
          <h2 className="mb-6 flex items-center gap-3 text-2xl font-bold">
            <Award className="h-6 w-6" />
            Abschlusstabelle
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b text-left">
                  <th className="py-3 pr-4">Platz</th>
                  <th className="px-4 py-3">Team</th>
                  <th className="px-4 py-3 text-center">Spiele</th>
                  <th className="px-4 py-3 text-center">Tordiff.</th>
                  <th className="py-3 pl-4 text-right">Punkte</th>
                </tr>
              </thead>
              <tbody>
                {content.finalTable.map(entry => (
                  <motion.tr
                    key={entry.position}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: entry.position * 0.05 }}
                    className={
                      entry.team.includes('Eintracht Spandau')
                        ? 'bg-gradient-to-r from-[var(--color-fanini-blue)]/10 to-[var(--color-fanini-red)]/10 font-bold'
                        : ''
                    }
                  >
                    <td className="py-3 pr-4">{entry.position}.</td>
                    <td className="px-4 py-3">{entry.team}</td>
                    <td className="px-4 py-3 text-center">{entry.played}</td>
                    <td className="px-4 py-3 text-center">{entry.goalDifference}</td>
                    <td className="py-3 pl-4 text-right">{entry.points}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      )}
    </div>
  );
};

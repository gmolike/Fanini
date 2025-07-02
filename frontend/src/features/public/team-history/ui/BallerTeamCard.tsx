// frontend/src/features/team-history/BallerTeamCard/BallerTeamCard.tsx
import { Target, TrendingUp, Trophy, Users } from 'lucide-react';

import type { BallerContent } from '@/entities/public/team-history';

import { Card, CardContent, CardHeader, CardTitle } from '@/shared/shadcn';

type BallerTeamCardProps = {
  content: BallerContent & { id: string };
  year: number;
};

/**
 * Zeigt Baller Liga / Fußball Team Informationen
 * @component
 */
export const BallerTeamCard = ({ content, year }: BallerTeamCardProps) => {
  type Position = 'TW' | 'IV' | 'LV' | 'RV' | 'ZM' | 'LM' | 'RM' | 'ST';

  const positionGroups: {
    defense: Position[];
    midfield: Position[];
    attack: Position[];
  } = {
    defense: ['TW', 'IV', 'LV', 'RV'],
    midfield: ['ZM', 'LM', 'RM'],
    attack: ['ST'],
  };

  const groupedSquad = {
    defense: content.squad.filter(p => positionGroups.defense.includes(p.position as Position)),
    midfield: content.squad.filter(p => positionGroups.midfield.includes(p.position as Position)),
    attack: content.squad.filter(p => positionGroups.attack.includes(p.position as Position)),
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-[var(--color-fanini-red)]" />
          Baller Liga Team {year}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Season Stats Overview */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="rounded-lg bg-[var(--color-muted)] p-3 text-center">
            <div className="text-2xl font-bold text-[var(--color-fanini-blue)]">
              {content.seasonStats.position}.
            </div>
            <div className="text-sm text-[var(--color-muted-foreground)]">Platz</div>
          </div>
          <div className="rounded-lg bg-[var(--color-muted)] p-3 text-center">
            <div className="text-2xl font-bold">{content.seasonStats.points}</div>
            <div className="text-sm text-[var(--color-muted-foreground)]">Punkte</div>
          </div>
          <div className="rounded-lg bg-[var(--color-muted)] p-3 text-center">
            <div className="text-2xl font-bold">
              {content.seasonStats.goalsFor}:{content.seasonStats.goalsAgainst}
            </div>
            <div className="text-sm text-[var(--color-muted-foreground)]">Tore</div>
          </div>
          <div className="rounded-lg bg-[var(--color-muted)] p-3 text-center">
            <div className="text-sm font-medium">
              {content.seasonStats.won}S-{content.seasonStats.drawn}U-{content.seasonStats.lost}N
            </div>
            <div className="text-sm text-[var(--color-muted-foreground)]">Bilanz</div>
          </div>
        </div>

        {/* Squad */}
        <div>
          <h4 className="mb-3 flex items-center gap-2 font-semibold">
            <Users className="h-4 w-4" />
            Kader
          </h4>

          {Object.entries(groupedSquad).map(([group, players]) => {
            if (players.length === 0) return null;

            let groupLabel = '';
            if (group === 'defense') {
              groupLabel = 'Abwehr';
            } else if (group === 'midfield') {
              groupLabel = 'Mittelfeld';
            } else {
              groupLabel = 'Angriff';
            }

            return (
              <div key={group} className="mb-4">
                <h5 className="mb-2 text-sm font-medium text-[var(--color-muted-foreground)] capitalize">
                  {groupLabel}
                </h5>
                <div className="grid gap-2">
                  {players.map(player => (
                    <div
                      key={player.name}
                      className="flex items-center justify-between rounded-lg bg-[var(--color-muted)] p-2"
                    >
                      <div className="flex items-center gap-3">
                        {player.jerseyNumber ? (
                          <span className="font-bold text-[var(--color-fanini-blue)]">
                            #{player.jerseyNumber}
                          </span>
                        ) : null}
                        <span className="font-medium">{player.name}</span>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-[var(--color-muted-foreground)]">
                          {player.position}
                        </span>
                        {player.goals || player.assists || player.appearances ? (
                          <div className="flex items-center gap-3 text-xs">
                            {player.appearances ? <span>{player.appearances} Spiele</span> : null}
                            {player.goals || player.assists ? (
                              <span>
                                {player.goals ?? 0} <Target className="inline h-3 w-3" /> |{' '}
                                {player.assists ?? 0} <TrendingUp className="inline h-3 w-3" />
                              </span>
                            ) : null}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Coaches */}
        {content.coaches.length > 0 && (
          <div>
            <h4 className="mb-3 font-semibold">Trainerstab</h4>
            <div className="space-y-2">
              {content.coaches.map(coach => (
                <div
                  key={coach.name}
                  className="flex items-center justify-between rounded-lg bg-[var(--color-muted)] p-2"
                >
                  <span className="font-medium">{coach.name}</span>
                  <div className="text-sm text-[var(--color-muted-foreground)]">
                    <span>{coach.role}</span>
                    {coach.period ? <span className="ml-2">({coach.period})</span> : null}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Match Highlights */}
        {content.highlights.length > 0 && (
          <div>
            <h4 className="mb-3 font-semibold">Spiel-Highlights</h4>
            <div className="space-y-2">
              {content.highlights.map(match => (
                <div key={`${match.date}-${match.opponent}`} className="rounded-lg border p-3">
                  <div className="mb-1 flex items-start justify-between">
                    <span className="font-medium">{match.opponent}</span>
                    <span className="font-bold text-[var(--color-fanini-blue)]">
                      {match.result}
                    </span>
                  </div>
                  <div className="text-sm text-[var(--color-muted-foreground)]">
                    {match.date} - {match.description}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Final Table Top 5 */}
        {content.finalTable.length > 0 && (
          <div>
            <h4 className="mb-3 font-semibold">Abschlusstabelle (Top 5)</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="py-2 text-left">Platz</th>
                    <th className="py-2 text-left">Team</th>
                    <th className="py-2 text-center">Spiele</th>
                    <th className="py-2 text-center">Tordiff.</th>
                    <th className="py-2 text-right">Punkte</th>
                  </tr>
                </thead>
                <tbody>
                  {content.finalTable.slice(0, 5).map(entry => (
                    <tr
                      key={entry.position}
                      className={
                        entry.team.includes('Eintracht Spandau')
                          ? 'bg-[var(--color-fanini-blue)]/10 font-medium'
                          : ''
                      }
                    >
                      <td className="py-2">{entry.position}.</td>
                      <td className="py-2">{entry.team}</td>
                      <td className="py-2 text-center">{entry.played}</td>
                      <td className="py-2 text-center">{entry.goalDifference}</td>
                      <td className="py-2 text-right">{entry.points}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

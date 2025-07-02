// frontend/src/features/team-history/LolTeamCard/LolTeamCard.tsx
import { Calendar, Gamepad2, Trophy, Users } from 'lucide-react';

import type { LolContent } from '@/entities/public/team-history';

import { Card, CardContent, CardHeader, CardTitle } from '@/shared/shadcn';

type LolTeamCardProps = {
  content: LolContent;
  year: number;
};

/**
 * Zeigt League of Legends Team Informationen
 * @component
 */
export const LolTeamCard = ({ content, year }: LolTeamCardProps) => {
  const roleOrder = ['Top', 'Jungle', 'Mid', 'Bot', 'Support'] as const;
  const sortedRoster = [...content.roster].sort(
    (a, b) => roleOrder.indexOf(a.role) - roleOrder.indexOf(b.role)
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Gamepad2 className="h-5 w-5 text-[var(--color-fanini-red)]" />
          League of Legends Team {year}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Roster */}
        <div>
          <h4 className="mb-3 flex items-center gap-2 font-semibold">
            <Users className="h-4 w-4" />
            Roster
          </h4>
          <div className="grid gap-2">
            {sortedRoster.map(player => (
              <div
                key={player.ign}
                className="flex items-center justify-between rounded-lg bg-[var(--color-muted)] p-2"
              >
                <div>
                  <span className="font-medium">{player.ign}</span>
                  {player.realName ? (
                    <span className="ml-2 text-sm text-[var(--color-muted-foreground)]">
                      ({player.realName})
                    </span>
                  ) : null}
                </div>
                <span className="rounded bg-[var(--color-fanini-blue)] px-2 py-1 text-sm font-medium text-white">
                  {player.role}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Coaches */}
        {content.coaches.length > 0 && (
          <div>
            <h4 className="mb-3 font-semibold">Coaching Staff</h4>
            <div className="space-y-2">
              {content.coaches.map((coach, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span>{coach.name}</span>
                  <span className="text-[var(--color-muted-foreground)]">{coach.role}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Seasons */}
        <div>
          <h4 className="mb-3 flex items-center gap-2 font-semibold">
            <Calendar className="h-4 w-4" />
            Seasons
          </h4>
          {content.seasons.map(season => (
            <div key={season.name} className="mb-4 rounded-lg border p-3">
              <div className="mb-2 flex items-start justify-between">
                <h5 className="font-medium">{season.name}</h5>
                <span className="text-sm font-bold">#{season.placement}</span>
              </div>
              <div className="text-sm text-[var(--color-muted-foreground)]">
                {season.wins}W - {season.losses}L
              </div>
              {season.tournaments.length > 0 && (
                <div className="mt-2 border-t pt-2">
                  {season.tournaments.map(tournament => (
                    <div key={tournament.name} className="text-sm">
                      {tournament.name}: {tournament.placement}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Achievements */}
        {content.achievements.length > 0 && (
          <div>
            <h4 className="mb-3 flex items-center gap-2 font-semibold">
              <Trophy className="h-4 w-4" />
              Erfolge
            </h4>
            <div className="space-y-2">
              {content.achievements.map((achievement, index) => (
                <div key={index} className="flex items-start gap-2">
                  <Trophy className="mt-0.5 h-4 w-4 text-yellow-500" />
                  <div>
                    <div className="text-sm font-medium">{achievement.title}</div>
                    {achievement.description ? (
                      <div className="text-xs text-[var(--color-muted-foreground)]">
                        {achievement.description}
                      </div>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

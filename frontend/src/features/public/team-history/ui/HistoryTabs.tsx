// frontend/src/features/team-history/HistoryTabs/HistoryTabs.tsx
import { Gamepad2, Globe, Heart, MoreHorizontal, Trophy, Users } from 'lucide-react';

import type { TeamHistoryYearResponse } from '@/entities/public/team-history';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/shadcn';

import { BallerTeamCard } from './BallerTeamCard';
import { FaniniCard } from './FaniniCard';
import { FernCard } from './FernCard';
import { LolTeamCard } from './LolTeamCard';
import { OtherCard } from './OtherCard';
import { SpecialEventsCard } from './SpecialEventsCard';
import { YearCommentCard } from './YearCommentCard';

type TeamHistoryTabsProps = {
  yearData: TeamHistoryYearResponse;
};

const TAB_CONFIG = {
  lol: { label: 'LoL Team', icon: Gamepad2 },
  baller: { label: 'Baller Liga', icon: Users },
  fanini: { label: 'Faninitiative', icon: Heart },
  fern: { label: 'Ferninitiative', icon: Globe },
  other: { label: 'Weitere', icon: MoreHorizontal },
} as const;

/**
 * Tab-Navigation für Team History eines Jahres
 * @component
 */
export const TeamHistoryTabs = ({ yearData }: TeamHistoryTabsProps) => {
  const availableTypes = [...new Set(yearData.teams.map(t => t.teamType))];
  const tabs = availableTypes.map(type => ({
    value: type,
    ...TAB_CONFIG[type],
  }));

  // Füge Special Events Tab hinzu wenn vorhanden
  if (Array.isArray(yearData.specialEvents) && yearData.specialEvents.length > 0) {
    tabs.push({
      value: 'special',
      label: 'Besondere Ereignisse',
      icon: Trophy,
    });
  }

  const defaultTab = tabs[0]?.value || 'lol';

  return (
    <div className="space-y-6">
      {/* Year Comment */}
      {yearData.faniniComment ? <YearCommentCard comment={yearData.faniniComment} /> : null}

      {/* Team Tabs */}
      {tabs.length > 0 && (
        <Tabs defaultValue={defaultTab} className="w-full">
          <TabsList
            className="grid w-full"
            style={{ gridTemplateColumns: `repeat(${tabs.length}, 1fr)` }}
          >
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <TabsTrigger key={tab.value} value={tab.value} className="flex items-center gap-2">
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          {availableTypes.includes('lol') && (
            <TabsContent value="lol" className="space-y-4">
              {yearData.teams
                .filter(t => t.teamType === 'lol')
                .map(team => (
                  <LolTeamCard key={team.id} content={team.content as any} year={yearData.year} />
                ))}
            </TabsContent>
          )}

          {availableTypes.includes('baller') && (
            <TabsContent value="baller" className="space-y-4">
              {yearData.teams
                .filter(t => t.teamType === 'baller')
                .map(team => (
                  <BallerTeamCard
                    key={team.id}
                    content={team.content as any}
                    year={yearData.year}
                  />
                ))}
            </TabsContent>
          )}

          {availableTypes.includes('fanini') && (
            <TabsContent value="fanini" className="space-y-4">
              {yearData.teams
                .filter(t => t.teamType === 'fanini')
                .map(team => (
                  <FaniniCard key={team.id} content={team.content as any} year={yearData.year} />
                ))}
            </TabsContent>
          )}

          {availableTypes.includes('fern') && (
            <TabsContent value="fern" className="space-y-4">
              {yearData.teams
                .filter(t => t.teamType === 'fern')
                .map(team => (
                  <FernCard key={team.id} content={team.content as any} year={yearData.year} />
                ))}
            </TabsContent>
          )}

          {availableTypes.includes('other') && (
            <TabsContent value="other" className="space-y-4">
              {yearData.teams
                .filter(t => t.teamType === 'other')
                .map(team => (
                  <OtherCard key={team.id} content={team.content as any} year={yearData.year} />
                ))}
            </TabsContent>
          )}

          {Array.isArray(yearData.specialEvents) && yearData.specialEvents.length > 0 ? (
            <TabsContent value="special">
              <SpecialEventsCard events={yearData.specialEvents} />
            </TabsContent>
          ) : null}
        </Tabs>
      )}
    </div>
  );
};

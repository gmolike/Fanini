// frontend/src/features/public/team-history-modern/ui/ContentPreview.tsx
import { Award, Calendar, Trophy, Users } from 'lucide-react';

import type { TeamContent, TeamType } from '@/entities/public/team-history';

type TeamContentPreviewProps = {
  content: TeamContent;
  type: TeamType;
};

export const TeamContentPreview = ({ content, type }: TeamContentPreviewProps) => {
  switch (type) {
    case 'lol': {
      const lolContent = content as any; // Type narrowing
      return (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <Users className="h-4 w-4" />
            <span>{lolContent.roster.length} Spieler</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Trophy className="h-4 w-4" />
            <span>{lolContent.achievements.length} Erfolge</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4" />
            <span>{lolContent.seasons.length} Seasons</span>
          </div>
        </div>
      );
    }
    case 'baller': {
      const ballerContent = content as any;
      return (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <Users className="h-4 w-4" />
            <span>{ballerContent.squad.length} Spieler</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Award className="h-4 w-4" />
            <span>Platz {ballerContent.seasonStats.position}</span>
          </div>
          <div className="text-sm font-medium">{ballerContent.seasonStats.points} Punkte</div>
        </div>
      );
    }
    case 'fanini': {
      const faniniContent = content as any;
      return (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <Users className="h-4 w-4" />
            <span>{faniniContent.members} Mitglieder</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4" />
            <span>{faniniContent.activities.length} Aktivitäten</span>
          </div>
        </div>
      );
    }
    case 'fern': {
      const fernContent = content as any;
      return (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <Users className="h-4 w-4" />
            <span>{fernContent.totalMembers} Mitglieder weltweit</span>
          </div>
          <div className="text-sm">{fernContent.chapters.length} Chapter</div>
        </div>
      );
    }
    default:
      return null;
  }
};

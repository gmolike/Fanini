// frontend/src/features/public/team-history-modern/ui/ContentPreview.tsx
import { Award, Calendar, Trophy, Users } from 'lucide-react';

import type { TeamContent, TeamType } from '@/entities/public/team-history';

type TeamContentPreviewProps = {
  content: TeamContent;
  type: TeamType;
};

// Type guards für Content-Typen
const isLolContent = (
  content: TeamContent
): content is TeamContent & {
  roster: unknown[];
  achievements: unknown[];
  seasons: unknown[];
} => {
  return 'roster' in content && 'achievements' in content && 'seasons' in content;
};

const isBallerContent = (
  content: TeamContent
): content is TeamContent & {
  squad: unknown[];
  seasonStats: { position: number; points: number };
} => {
  return 'squad' in content && 'seasonStats' in content;
};

const isFaniniContent = (
  content: TeamContent
): content is TeamContent & {
  members: number;
  activities: unknown[];
} => {
  return 'members' in content && 'activities' in content;
};

const isFernContent = (
  content: TeamContent
): content is TeamContent & {
  totalMembers: number;
  chapters: unknown[];
} => {
  return 'totalMembers' in content && 'chapters' in content;
};

export const TeamContentPreview = ({ content, type }: TeamContentPreviewProps) => {
  switch (type) {
    case 'lol': {
      if (!isLolContent(content)) return null;
      return (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <Users className="h-4 w-4" />
            <span>{content.roster.length} Spieler</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Trophy className="h-4 w-4" />
            <span>{content.achievements.length} Erfolge</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4" />
            <span>{content.seasons.length} Seasons</span>
          </div>
        </div>
      );
    }
    case 'baller': {
      if (!isBallerContent(content)) return null;
      return (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <Users className="h-4 w-4" />
            <span>{content.squad.length} Spieler</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Award className="h-4 w-4" />
            <span>Platz {content.seasonStats.position}</span>
          </div>
          <div className="text-sm font-medium">{content.seasonStats.points} Punkte</div>
        </div>
      );
    }
    case 'fanini': {
      if (!isFaniniContent(content)) return null;
      return (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <Users className="h-4 w-4" />
            <span>{content.members} Mitglieder</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4" />
            <span>{content.activities.length} Aktivitäten</span>
          </div>
        </div>
      );
    }
    case 'fern': {
      if (!isFernContent(content)) return null;
      return (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <Users className="h-4 w-4" />
            <span>{content.totalMembers} Mitglieder weltweit</span>
          </div>
          <div className="text-sm">{content.chapters.length} Chapter</div>
        </div>
      );
    }
    default:
      return null;
  }
};

// frontend/src/entities/team-history/model/types.ts

/**
 * Basis-Interface für alle Team-History Einträge
 */
export type TeamHistoryEntry = {
  id: string;
  year: number;
  teamType: TeamType;
  content: TeamContent;
  faniniComment: string;
  createdAt: string;
  updatedAt: string;
};

/**
 * Unterstützte Team-Typen
 */
export type TeamType = 'lol' | 'baller' | 'fanini' | 'fern' | 'other';

/**
 * Union Type für verschiedene Content-Typen
 */
export type TeamContent = LolContent | BallerContent | FaniniContent | FernContent | OtherContent;

/**
 * League of Legends Team Content
 */
export type LolContent = {
  id: string;
  type: 'lol';
  roster: LolPlayer[];
  coaches: Coach[];
  achievements: Achievement[];
  seasons: LolSeason[];
  highlights: string[];
};

export type LolPlayer = {
  id: string;
  ign: string; // In-Game Name
  realName?: string;
  role: 'Top' | 'Jungle' | 'Mid' | 'Bot' | 'Support';
  joinedDate?: string;
  leftDate?: string;
  socialLinks?: SocialLinks;
};

export type LolSeason = {
  id: string;
  name: string; // z.B. "Spring Split 2024"
  placement: number;
  wins: number;
  losses: number;
  tournaments: Tournament[];
};

/**
 * Baller Liga / Fußball Content
 */
export type BallerContent = {
  id: string;
  type: 'baller';
  squad: BallerPlayer[];
  coaches: Coach[];
  seasonStats: BallerSeasonStats;
  highlights: MatchHighlight[];
  finalTable: TableEntry[];
};

export type BallerPlayer = {
  id: string;
  name: string;
  position: 'TW' | 'IV' | 'LV' | 'RV' | 'ZM' | 'LM' | 'RM' | 'ST';
  jerseyNumber?: number;
  goals?: number;
  assists?: number;
  appearances?: number;
};

export type BallerSeasonStats = {
  id: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  points: number;
  position: number;
};

/**
 * Fanini Content - Faninitiative spezifische Aktivitäten
 */
export type FaniniContent = {
  id: string;
  type: 'fanini';
  title: string;
  description: string;
  activities: FaniniActivity[];
  members: number;
  foundedDate?: string;
  images?: string[];
};

export type FaniniActivity = {
  id: string;
  name: string;
  date: string;
  participants?: number;
  description: string;
  images?: string[];
};

/**
 * Fern Content - Ferninitiative / Remote Fans
 */
export type FernContent = {
  id: string;
  type: 'fern';
  title: string;
  description: string;
  chapters: FernChapter[];
  totalMembers: number;
  activities: string[];
};

export type FernChapter = {
  id: string;
  location: string;
  country?: string;
  memberCount: number;
  foundedDate?: string;
  contact?: string;
};

/**
 * Other Content - Sonstige Teams/Gruppen
 */
export type OtherContent = {
  id: string;
  type: 'other';
  name: string;
  category: string;
  description: string;
  customFields: Record<string, string | number | boolean | null>;
};

/**
 * Gemeinsame Typen
 */
export type Coach = {
  id: string;
  name: string;
  role: string;
  period: string;
};

export type Achievement = {
  id: string;
  title: string;
  date: string;
  description?: string;
  icon?: string;
};

export type Tournament = {
  id: string;
  name: string;
  placement: string;
  date: string;
};

export type MatchHighlight = {
  id: string;
  opponent: string;
  result: string;
  date: string;
  description: string;
};

export type TableEntry = {
  id: string;
  position: number;
  team: string;
  played: number;
  points: number;
  goalDifference: string;
};

export type SocialLinks = {
  id: string;
  twitter?: string;
  instagram?: string;
  twitch?: string;
};

/**
 * Fanini Comment Type - Der Kommentar der Faninitiative zum Jahr
 */
export type FaniniYearComment = {
  id: string;
  year: number;
  headline: string;
  content: string;
  author?: string;
  highlights: string[];
  lowlights?: string[];
  outlook?: string;
};

/**
 * Special Event Content Type
 */
export type SpecialEventContent = {
  id: string;
  type: 'special';
  title: string;
  date: string;
  description: string;
  category: 'championship' | 'celebration' | 'milestone' | 'other';
  images?: string[];
  videoUrl?: string;
};

/**
 * Response Types
 */
export type TeamHistoryYearResponse = {
  id: string;
  year: number;
  faniniComment: FaniniYearComment;
  teams: TeamHistoryEntry[];
  specialEvents: SpecialEventContent[];
};

export type AvailableYearsResponse = {
  id: string;
  years: number[];
  teamTypes: Record<number, TeamType[]>;
};

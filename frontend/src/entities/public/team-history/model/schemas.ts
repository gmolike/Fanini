// frontend/src/entities/team-history/model/schemas.ts
import { z } from 'zod';

// Team Type Enum
const teamTypeSchema = z.enum(['lol', 'baller', 'fanini', 'fern', 'other']);

// Social Links Schema
const socialLinksSchema = z.object({
  id: z.string(),
  twitter: z.string().optional(),
  instagram: z.string().optional(),
  twitch: z.string().optional(),
});

// Coach Schema
const coachSchema = z.object({
  id: z.string(),
  name: z.string(),
  role: z.string(),
  period: z.string(),
});

// Achievement Schema
const achievementSchema = z.object({
  id: z.string(),
  title: z.string(),
  date: z.string(),
  description: z.string().optional(),
  icon: z.string().optional(),
});

// Tournament Schema
const tournamentSchema = z.object({
  id: z.string(),
  name: z.string(),
  placement: z.string(),
  date: z.string(),
});

// LoL Player Schema
const lolPlayerSchema = z.object({
  id: z.string(),
  ign: z.string(),
  realName: z.string().optional(),
  role: z.enum(['Top', 'Jungle', 'Mid', 'Bot', 'Support']),
  joinedDate: z.string().optional(),
  leftDate: z.string().optional(),
  socialLinks: socialLinksSchema.optional(),
});

// LoL Season Schema
const lolSeasonSchema = z.object({
  id: z.string(),
  name: z.string(),
  placement: z.number(),
  wins: z.number(),
  losses: z.number(),
  tournaments: z.array(tournamentSchema),
});

// LoL Content Schema
const lolContentSchema = z.object({
  id: z.string(),
  type: z.literal('lol'),
  roster: z.array(lolPlayerSchema),
  coaches: z.array(coachSchema),
  achievements: z.array(achievementSchema),
  seasons: z.array(lolSeasonSchema),
  highlights: z.array(z.string()),
});

// Baller Player Schema
const ballerPlayerSchema = z.object({
  id: z.string(),
  name: z.string(),
  position: z.enum(['TW', 'IV', 'LV', 'RV', 'ZM', 'LM', 'RM', 'ST']),
  jerseyNumber: z.number().optional(),
  goals: z.number().optional(),
  assists: z.number().optional(),
  appearances: z.number().optional(),
});

// Baller Season Stats Schema
const ballerSeasonStatsSchema = z.object({
  id: z.string(),
  played: z.number(),
  won: z.number(),
  drawn: z.number(),
  lost: z.number(),
  goalsFor: z.number(),
  goalsAgainst: z.number(),
  points: z.number(),
  position: z.number(),
});

// Match Highlight Schema
const matchHighlightSchema = z.object({
  id: z.string(),
  opponent: z.string(),
  result: z.string(),
  date: z.string(),
  description: z.string(),
});

// Table Entry Schema
const tableEntrySchema = z.object({
  id: z.string(),
  position: z.number(),
  team: z.string(),
  played: z.number(),
  points: z.number(),
  goalDifference: z.string(),
});

// Baller Content Schema
const ballerContentSchema = z.object({
  id: z.string(),
  type: z.literal('baller'),
  squad: z.array(ballerPlayerSchema),
  coaches: z.array(coachSchema),
  seasonStats: ballerSeasonStatsSchema,
  highlights: z.array(matchHighlightSchema),
  finalTable: z.array(tableEntrySchema),
});

// Fanini Activity Schema
const faniniActivitySchema = z.object({
  id: z.string(),
  name: z.string(),
  date: z.string(),
  participants: z.number().optional(),
  description: z.string(),
  images: z.array(z.string()).optional(),
});

// Fanini Content Schema
const faniniContentSchema = z.object({
  id: z.string(),
  type: z.literal('fanini'),
  title: z.string(),
  description: z.string(),
  activities: z.array(faniniActivitySchema),
  members: z.number(),
  foundedDate: z.string().optional(),
  images: z.array(z.string()).optional(),
});

// Fern Chapter Schema
const fernChapterSchema = z.object({
  id: z.string(),
  location: z.string(),
  country: z.string().optional(),
  memberCount: z.number(),
  foundedDate: z.string().optional(),
  contact: z.string().optional(),
});

// Fern Content Schema
const fernContentSchema = z.object({
  id: z.string(),
  type: z.literal('fern'),
  title: z.string(),
  description: z.string(),
  chapters: z.array(fernChapterSchema),
  totalMembers: z.number(),
  activities: z.array(z.string()),
});

// Other Content Schema
const otherContentSchema = z.object({
  id: z.string(),
  type: z.literal('other'),
  name: z.string(),
  category: z.string(),
  description: z.string(),
  customFields: z.record(z.union([z.string(), z.number(), z.boolean(), z.null()])),
});

// Content Union Schema
const contentSchema = z.union([
  lolContentSchema,
  ballerContentSchema,
  faniniContentSchema,
  fernContentSchema,
  otherContentSchema,
]);

// Team History Entry Schema
const teamHistoryEntrySchema = z.object({
  id: z.string(),
  year: z.number(),
  teamType: teamTypeSchema,
  content: contentSchema,
  faniniComment: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

// Fanini Year Comment Schema
const faniniYearCommentSchema = z.object({
  id: z.string(),
  year: z.number(),
  headline: z.string(),
  content: z.string(),
  author: z.string().optional(),
  highlights: z.array(z.string()),
  lowlights: z.array(z.string()).optional(),
  outlook: z.string().optional(),
});

// Special Event Schema
const specialEventSchema = z.object({
  id: z.string(),
  type: z.literal('special'),
  title: z.string(),
  date: z.string(),
  description: z.string(),
  category: z.enum(['championship', 'celebration', 'milestone', 'other']),
  images: z.array(z.string()).optional(),
  videoUrl: z.string().optional(),
});

// Response Schemas
export const teamHistoryYearResponseSchema = z.object({
  id: z.string(),
  year: z.number(),
  faniniComment: faniniYearCommentSchema,
  teams: z.array(teamHistoryEntrySchema),
  specialEvents: z.array(specialEventSchema),
});

export const availableYearsResponseSchema = z.object({
  id: z.string(),
  years: z.array(z.number()),
  teamTypes: z.record(z.number(), z.array(teamTypeSchema)),
});

// Export individual schemas for reuse
export {
  achievementSchema,
  ballerContentSchema,
  ballerPlayerSchema,
  ballerSeasonStatsSchema,
  coachSchema,
  contentSchema,
  faniniActivitySchema,
  faniniContentSchema,
  faniniYearCommentSchema,
  fernChapterSchema,
  fernContentSchema,
  lolContentSchema,
  lolPlayerSchema,
  lolSeasonSchema,
  matchHighlightSchema,
  otherContentSchema,
  socialLinksSchema,
  specialEventSchema,
  tableEntrySchema,
  teamHistoryEntrySchema,
  teamTypeSchema,
  tournamentSchema,
};

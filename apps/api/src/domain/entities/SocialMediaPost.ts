// apps/api/src/domain/entities/SocialMediaPost.ts
import { generateId } from "@faninitiative/shared";

export type SocialMediaPlatform = "instagram" | "twitter" | "facebook" | "linkedin" | "tiktok";
export type PostStatus = "draft" | "scheduled" | "published" | "failed";

/**
 * SocialMediaPost Entity
 * @description Geplanter oder veröffentlichter Social Media Beitrag
 */
export type SocialMediaPost = {
  readonly id: string;
  readonly inhalt: string;
  readonly plattform: SocialMediaPlatform[];
  readonly eventId?: string;
  readonly postDatum?: Date;
  readonly status: PostStatus;
  readonly erstelltVon: string;
  readonly erstelltAm: Date;
  readonly approvedVon?: string;
  readonly approvedAm?: Date;
  readonly hashtags?: string[];
  readonly medienUrls?: string[];
  metadata?: {
    eventTitel?: string;
    erstellerName?: string;
  };
};

/**
 * Erstellt einen neuen Social Media Post
 */
export const createSocialMediaPost = (params: {
  inhalt: string;
  plattform: SocialMediaPlatform[];
  eventId?: string;
  postDatum?: Date;
  erstelltVon: string;
  hashtags?: string[];
  medienUrls?: string[];
}): SocialMediaPost => ({
  id: generateId(),
  inhalt: params.inhalt,
  plattform: params.plattform,
  eventId: params.eventId,
  postDatum: params.postDatum,
  status: "draft",
  erstelltVon: params.erstelltVon,
  erstelltAm: new Date(),
  hashtags: params.hashtags,
  medienUrls: params.medienUrls
});

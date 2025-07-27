// apps/api/src/domain/entities/Creator.ts
import { generateId } from "@faninitiative/shared";

export type CreatorType =
  | "fotograf"
  | "videograf"
  | "grafiker"
  | "texter"
  | "musiker"
  | "streamer";

export type WorkType = "image" | "video" | "audio" | "text";

/**
 * Creator Work
 * @description Ein Werk eines Creators
 */
export type CreatorWork = {
  readonly id: string;
  readonly creatorId: string;
  readonly title: string;
  readonly description?: string;
  readonly type: WorkType;
  readonly fileUrl: string;
  readonly thumbnailUrl?: string;
  readonly createdAt: Date;
  readonly publishedAt?: Date;
  readonly isPublic: boolean;
  readonly orderPosition: number;
  readonly views: number;
  readonly likes: number;
};

/**
 * Creator Entity
 * @description Repräsentiert ein Creator-Profil
 */
export type Creator = {
  readonly id: string;
  readonly memberId: string;
  readonly artistName: string;
  readonly realName?: string;
  readonly profileImage?: string;
  readonly description: string;
  readonly portfolio?: string;
  readonly isActive: boolean;
  readonly activeSince?: Date;
  readonly deactivatedAt?: Date;
  readonly socialMedia: {
    instagram?: string;
    twitter?: string;
    facebook?: string;
    youtube?: string;
    tiktok?: string;
    website?: string;
  };
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly types: string[];
  readonly works: CreatorWork[];
  metadata?: {
    workCount?: number;
    memberName?: string;
    memberEmail?: string;
  };
};

/**
 * Erstellt ein neues Creator-Profil
 */
export const createCreator = (params: {
  memberId: string;
  artistName: string;
  realName?: string;
  description: string;
  types: string[];
}): Omit<Creator, "id" | "createdAt" | "updatedAt" | "works"> => ({
  memberId: params.memberId,
  artistName: params.artistName,
  realName: params.realName,
  description: params.description,
  portfolio: undefined,
  profileImage: undefined,
  isActive: false,
  activeSince: undefined,
  deactivatedAt: undefined,
  socialMedia: {},
  types: params.types,
  metadata: undefined,
});

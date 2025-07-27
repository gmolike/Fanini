// apps/api/src/domain/entities/Gremium.ts
import { generateId } from "@faninitiative/shared";

export type GremiumType = "vorstand" | "beirat" | "kassenprufer";

/**
 * GremiumMember
 * @description Mitglied eines Gremiums
 */
export type GremiumMember = {
  readonly id: string;
  readonly gremiumId: string;
  readonly name: string;
  readonly role: string;
  readonly image?: string;
  readonly description?: string;
  readonly memberSince?: Date;
  readonly email?: string;
  readonly phone?: string;
  readonly orderPosition: number;
  eingereichtVonName?: string;
};

/**
 * Gremium Entity
 * @description Repräsentiert ein Vereinsgremium
 */
export type Gremium = {
  readonly id: string;
  readonly type: GremiumType;
  readonly name: string;
  readonly description: string;
  readonly shortDescription?: string;
  readonly headerImage?: string;
  readonly gradient?: string;
  readonly meetingSchedule?: string;
  readonly contactEmail?: string;
  readonly establishedDate?: Date;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly members: GremiumMember[];
};

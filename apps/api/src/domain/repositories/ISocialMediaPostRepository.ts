// apps/api/src/domain/repositories/ISocialMediaPostRepository.ts
import type { SocialMediaPost } from "@/domain/entities/SocialMediaPost";

export type SocialMediaFilters = {
  platform?: string;
  status?: "draft" | "scheduled" | "published";
  eventId?: string;
  dateFrom?: Date;
  dateTo?: Date;
};

export type ISocialMediaPostRepository = {
  findAll(
    userId: string,
    filters?: SocialMediaFilters,
  ): Promise<SocialMediaPost[]>;
  findById(id: string, userId: string): Promise<SocialMediaPost | null>;
  create(
    data: Omit<SocialMediaPost, "id" | "erstelltAm">,
    userId: string,
  ): Promise<SocialMediaPost>;
  update(
    id: string,
    data: Partial<SocialMediaPost>,
    userId: string,
  ): Promise<SocialMediaPost>;
  delete(id: string, userId: string): Promise<void>;
  approve(id: string, userId: string): Promise<void>;
};

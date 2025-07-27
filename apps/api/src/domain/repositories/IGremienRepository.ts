// apps/api/src/domain/repositories/IGremienRepository.ts
import type { Gremium, GremiumMember } from "@/domain/entities/Gremium";

export type GremiumFilters = {
  type?: string;
  includeMembers?: boolean;
}

export type IGremienRepository = {
  // Public
  findAllPublic(): Promise<Gremium[]>;
  findByTypePublic(type: string): Promise<Gremium | null>;

  // Internal
  findAllInternal(userId: string): Promise<Gremium[]>;
  findByIdInternal(id: string, userId: string): Promise<Gremium | null>;
  updateGremium(id: string, data: Partial<Gremium>, userId: string): Promise<Gremium>;

  // Members
  addMember(gremiumId: string, member: Omit<GremiumMember, 'id'>, userId: string): Promise<GremiumMember>;
  updateMember(memberId: string, data: Partial<GremiumMember>, userId: string): Promise<GremiumMember>;
  removeMember(memberId: string, userId: string): Promise<void>;
}

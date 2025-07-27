// apps/api/src/domain/repositories/IFAQRepository.ts
import type { FAQ } from "@/domain/entities/FAQ";

export type FAQFilters = {
  category?: string;
  search?: string;
  popularOnly?: boolean;
}

export type IFAQRepository = {
  findAllPublic(filters?: FAQFilters): Promise<FAQ[]>;
  findByIdPublic(id: string): Promise<FAQ | null>;
  create(data: Omit<FAQ, 'id' | 'createdAt' | 'views'>, userId: string): Promise<FAQ>;
  update(id: string, data: Partial<FAQ>, userId: string): Promise<FAQ>;
  delete(id: string, userId: string): Promise<void>;
  incrementViews(id: string): Promise<void>;
}

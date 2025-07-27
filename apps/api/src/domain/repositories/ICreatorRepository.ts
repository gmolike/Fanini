// apps/api/src/domain/repositories/ICreatorRepository.ts
import type { Creator, CreatorWork } from "@/domain/entities/Creator";
import type { ApprovalRequest } from "@/domain/entities/ApprovalRequest";

export type CreatorFilters = {
  istAktiv?: boolean;
  type?: string;
  search?: string;
};

export type ICreatorRepository = {
  // Public
  findAllPublic(filters?: CreatorFilters): Promise<Creator[]>;
  findByIdPublic(id: string): Promise<Creator | null>;

  // Internal
  findAllInternal(userId: string, filters?: CreatorFilters): Promise<Creator[]>;
  findByMemberId(memberId: string): Promise<Creator | null>;
  create(
    data: Omit<Creator, "id" | "aktivSeit">,
    userId: string,
  ): Promise<Creator | ApprovalRequest>;
  update(id: string, data: Partial<Creator>, userId: string): Promise<Creator>;
  activate(id: string, userId: string): Promise<void>;
  deactivate(id: string, userId: string): Promise<void>;

  // Works
  findWorksByCreator(
    creatorId: string,
    isPublic?: boolean,
  ): Promise<CreatorWork[]>;
  addWork(
    creatorId: string,
    work: Omit<CreatorWork, "id" | "erstelltAm">,
    userId: string,
  ): Promise<CreatorWork>;
  updateWork(
    workId: string,
    data: Partial<CreatorWork>,
    userId: string,
  ): Promise<CreatorWork>;
  deleteWork(workId: string, userId: string): Promise<void>;
  incrementViews(workId: string): Promise<void>;
};

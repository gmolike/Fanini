// apps/api/src/domain/repositories/IProtokollRepository.ts
import type { Protokoll, Tagesordnungspunkt } from "@/domain/entities/Protokoll";
import type { ApprovalRequest } from "@/domain/entities/ApprovalRequest";

export type ProtokollFilters = {
  bereichId?: string;
  status?: 'entwurf' | 'genehmigt';
  jahr?: number;
  search?: string;
}

export type IProtokollRepository = {
  findAllInternal(filters?: ProtokollFilters, userId: string): Promise<Protokoll[]>;
  findByIdInternal(id: string, userId: string): Promise<Protokoll | null>;
  create(data: Omit<Protokoll, 'id' | 'erstelltAm'>, userId: string): Promise<Protokoll>;
  update(id: string, data: Partial<Protokoll>, userId: string): Promise<Protokoll | ApprovalRequest>;

  // Tagesordnungspunkte
  addTagesordnungspunkt(protokollId: string, punkt: Omit<Tagesordnungspunkt, 'id'>, userId: string): Promise<Tagesordnungspunkt>;
  updateTagesordnungspunkt(punktId: string, data: Partial<Tagesordnungspunkt>, userId: string): Promise<Tagesordnungspunkt>;
  removeTagesordnungspunkt(punktId: string, userId: string): Promise<void>;
}

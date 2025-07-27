// apps/api/src/domain/repositories/IAusgabenRepository.ts
import type { Ausgabe } from "@/domain/entities/Ausgabe";
import type { ApprovalRequest } from "@/domain/entities/ApprovalRequest";

export type AusgabenFilters = {
  eventId?: string;
  status?: "eingereicht" | "genehmigt" | "abgelehnt";
  kategorie?: string;
  dateFrom?: Date;
  dateTo?: Date;
};

export type IAusgabenRepository = {
  findAll(userId: string, filters?: AusgabenFilters): Promise<Ausgabe[]>;
  findById(id: string, userId: string): Promise<Ausgabe | null>;
  create(
    data: Omit<Ausgabe, "id" | "eingereichtAm">,
    userId: string,
  ): Promise<Ausgabe>;
  update(
    id: string,
    data: Partial<Ausgabe>,
    userId: string,
  ): Promise<Ausgabe | ApprovalRequest>;
  delete(id: string, userId: string): Promise<void>;
  getTotalByEvent(eventId: string): Promise<number>;
  getTotalByCategory(eventId: string): Promise<Record<string, number>>;
};

// apps/api/src/domain/repositories/IEmailVorlageRepository.ts
import type { EmailVorlage } from "@/domain/entities/EmailVorlage";

export type EmailVorlageFilters = {
  kategorie?: string;
  istAktiv?: boolean;
}

export type IEmailVorlageRepository = {
  findAll(filters?: EmailVorlageFilters): Promise<EmailVorlage[]>;
  findById(id: string): Promise<EmailVorlage | null>;
  findByKategorie(kategorie: string): Promise<EmailVorlage[]>;
  create(data: Omit<EmailVorlage, 'id' | 'erstelltAm'>, userId: string): Promise<EmailVorlage>;
  update(id: string, data: Partial<EmailVorlage>, userId: string): Promise<EmailVorlage>;
  delete(id: string, userId: string): Promise<void>;
  renderTemplate(id: string, data: Record<string, any>): Promise<string>;
}

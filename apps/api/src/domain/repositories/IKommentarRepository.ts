// apps/api/src/domain/repositories/IKommentarRepository.ts
import type { Kommentar } from "@/domain/entities/Kommentar";

export type KommentarContext = {
  type: 'event' | 'task' | 'document';
  id: string;
}

export type IKommentarRepository = {
  findByContext(context: KommentarContext): Promise<Kommentar[]>;
  create(data: Omit<Kommentar, 'id' | 'erstelltAm'>, userId: string): Promise<Kommentar>;
  update(id: string, text: string, userId: string): Promise<Kommentar>;
  delete(id: string, userId: string): Promise<void>;
}

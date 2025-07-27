// apps/api/src/infrastructure/repositories/PublicAccessRepository.ts
import { BaseRepository } from "./BaseRepository";

export abstract class PublicAccessRepository<T> extends BaseRepository<T> {
  abstract findAllPublic(filters?: any): Promise<T[]>;
  abstract findByIdPublic(id: string): Promise<T | null>;

  protected addPublicFilter(sql: string, alias?: string): string {
    const prefix = alias ? `${alias}.` : "";
    return `${sql} AND ${prefix}ist_oeffentlich = 1`;
  }
}

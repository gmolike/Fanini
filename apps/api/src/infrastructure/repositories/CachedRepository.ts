import { BaseRepository } from "./BaseRepository";

// apps/api/src/infrastructure/repositories/CachedRepository.ts
export abstract class CachedRepository<T> extends BaseRepository<T> {
  private readonly cache = new Map<string, { data: T; expires: number }>();
  private readonly cacheTTL = 5 * 60 * 1000; // 5 Minuten

  protected async getFromCache<R>(
    key: string,
    fetcher: () => Promise<R>
  ): Promise<R> {
    const cached = this.cache.get(key);

    if (cached && cached.expires > Date.now()) {
      return cached.data as unknown as R;
    }

    const data = await fetcher();

    this.cache.set(key, {
      data: data as any,
      expires: Date.now() + this.cacheTTL
    });

    return data;
  }

  protected invalidateCache(pattern?: string): void {
    if (!pattern) {
      this.cache.clear();
      return;
    }

    for (const key of this.cache.keys()) {
      if (key.includes(pattern)) {
        this.cache.delete(key);
      }
    }
  }

  // Override save to invalidate cache
  async save(entity: T): Promise<T> {
    if (typeof super.save === "function") {
      const result = await super.save(entity);
      this.invalidateCache(); // Oder spezifischer
      return result;
    }
    throw new Error("BaseRepository.save is not implemented.");
  }
}

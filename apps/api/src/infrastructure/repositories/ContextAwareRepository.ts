import { BaseRepository } from "./BaseRepository";

// apps/api/src/infrastructure/repositories/ContextAwareRepository.ts
export interface WithContext {
  context: {
    type: string;
    id: string;
  };
}

export abstract class ContextAwareRepository<T extends WithContext>
  extends BaseRepository<T> {

  // Generische Context-Suche
  async findByContext(
    contextType: string,
    contextId: string,
    additionalFilters?: Record<string, any>
  ): Promise<T[]> {
    let sql = `
      SELECT * FROM ${this.tableName}
      WHERE context_type = ?
      AND context_id = ?
      AND ${this.softDeleteClause()}
    `;
    const params: any[] = [contextType, contextId];

    // Zusätzliche Filter
    if (additionalFilters) {
      for (const [key, value] of Object.entries(additionalFilters)) {
        sql += ` AND ${key} = ?`;
        params.push(value);
      }
    }

    const rows = await this.db.query<any[]>(sql, params);
    return rows.map(row => this.mapRowToEntity(row));
  }

  // Context-übergreifende Suche
  async findByContextType(contextType: string): Promise<T[]> {
    const rows = await this.db.query<any[]>(
      `SELECT * FROM ${this.tableName}
       WHERE context_type = ?
       AND ${this.softDeleteClause()}
       ORDER BY erstellt_am DESC`,
      [contextType]
    );

    return rows.map(row => this.mapRowToEntity(row));
  }

  protected abstract mapRowToEntity(row: any): T;
}

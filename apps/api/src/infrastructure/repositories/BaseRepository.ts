// apps/api/src/infrastructure/repositories/BaseRepository.ts
import { MySQLConnection } from "./MySQLConnection";

export interface AuditInfo {
  createdBy: string;
  createdByUserId: string;
  createdAt: Date;
  updatedBy?: string;
  updatedByUserId?: string;
  updatedAt?: Date;
}

export interface SoftDeletable {
  deletedAt?: Date;
  deletedBy?: string;
}

export abstract class BaseRepository<T> {
  constructor(
    protected readonly db: MySQLConnection, 
    protected readonly tableName: string,
  ) {}

  // Base save Methode (optional, kann überschrieben werden)
  async save?(entity: T, userId?: string): Promise<T> {
    throw new Error("save must be implemented by subclass");
  }

  // Helper: Soft Delete WHERE clause
  protected softDeleteClause(alias?: string): string {
    const prefix = alias ? `${alias}.` : "";
    return `${prefix}deleted_at IS NULL`;
  }

  // Helper: Add audit info
  protected addAuditInfo<E>(
    entity: E,
    userId: string,
    memberId?: string,
  ): E & AuditInfo {
    return {
      ...entity,
      createdBy: memberId || userId,
      createdByUserId: userId,
      createdAt: new Date(),
      updatedBy: memberId || userId,
      updatedByUserId: userId,
      updatedAt: new Date(),
    };
  }

  // Soft delete implementation
  async softDelete(id: string, userId: string): Promise<void> {
    await this.db.query(
      `UPDATE ${this.tableName}
       SET deleted_at = NOW(), deleted_by = ?
       WHERE id = ? AND deleted_at IS NULL`,
      [userId, id],
    );
  }
}

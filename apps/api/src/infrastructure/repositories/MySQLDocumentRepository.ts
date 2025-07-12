// apps/api/src/infrastructure/repositories/MySQLDocumentRepository.ts
import { GoogleDriveService } from '../services/GoogleDriveService';
import { Document } from '@/domain/entities/Document';
import { MySQLConnection } from './MySQLConnection';
import { DocumentFilters, IDocumentRepository } from '@/domain/repositories/IDocumentRepository';

export class MySQLDocumentRepository implements IDocumentRepository {
  constructor(
    private readonly db: MySQLConnection,
    private readonly googleDrive: GoogleDriveService
  ) {}
  findByGoogleDriveId(googleDriveFileId: string): Promise<Document | null> {
    throw new Error('Method not implemented.');
  }

  async findAll(filters?: DocumentFilters): Promise<Document[]> {
    let sql = `
      SELECT
        d.*,
        d.google_drive_file_id as googleDriveFileId,
        d.is_public as isPublic,
        d.created_at as createdAt,
        d.updated_at as updatedAt
      FROM documents d
      WHERE 1=1
    `;
    const params: any[] = [];

    if (filters?.category) {
      sql += ' AND d.category = ?';
      params.push(filters.category);
    }

    if (filters?.isPublic !== undefined) {
      sql += ' AND d.is_public = ?';
      params.push(filters.isPublic);
    }

    sql += ' ORDER BY d.created_at DESC';

    const rows = await this.db.query<any[]>(sql, params);

    return rows.map(row => Document.fromDatabase(row));
  }

  async findById(id: string): Promise<Document | null> {
    const rows = await this.db.query<any[]>(
      `SELECT
        d.*,
        d.google_drive_file_id as googleDriveFileId,
        d.is_public as isPublic,
        d.created_at as createdAt,
        d.updated_at as updatedAt
      FROM documents d
      WHERE d.id = ?`,
      [id]
    );

    if (rows.length === 0) return null;

    return Document.fromDatabase(rows[0]);
  }

  async save(document: Document): Promise<Document> {
    const sql = `
      INSERT INTO documents
      (id, title, description, category, google_drive_file_id, file_url,
       file_size, file_type, version, status, is_public, created_by,
       created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        title = VALUES(title),
        description = VALUES(description),
        file_url = VALUES(file_url),
        file_size = VALUES(file_size),
        version = VALUES(version),
        status = VALUES(status),
        updated_at = VALUES(updated_at)
    `;

    await this.db.query(sql, [
      document.id,
      document.title,
      document.description,
      document.category,
      document.googleDriveFileId,
      document.fileUrl,
      document.fileSize,
      document.fileType,
      document.version,
      document.status,
      document.isPublic,
      document.createdBy,
      document.createdAt,
      document.updatedAt
    ]);

    return document;
  }

  async delete(id: string): Promise<void> {
    // Get document to retrieve Google Drive file ID
    const document = await this.findById(id);
    if (document?.googleDriveFileId) {
      // Delete from Google Drive
      await this.googleDrive.deleteFile(document.googleDriveFileId);
    }

    // Delete from database
    await this.db.query('DELETE FROM documents WHERE id = ?', [id]);
  }

  async updateDownloadCount(id: string): Promise<void> {
    await this.db.query(
      'UPDATE documents SET downloads = downloads + 1 WHERE id = ?',
      [id]
    );
  }
}

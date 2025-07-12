// apps/api/src/domain/repositories/IDocumentRepository.ts
import { Document } from "../entities/Document";

export type DocumentFilters = {
  category?: string;
  isPublic?: boolean;
  documentType?: string;
  searchTerm?: string;
  limit?: number;
  offset?: number;
};

/**
 * Document Repository Interface
 * @description Definiert Methoden für Document-Datenzugriff
 */
export interface IDocumentRepository {
  findAll(filters?: DocumentFilters): Promise<Document[]>;
  findById(id: string): Promise<Document | null>;
  findByGoogleDriveId(googleDriveFileId: string): Promise<Document | null>;
  save(document: Document): Promise<Document>;
  delete(id: string): Promise<void>;
  updateDownloadCount(id: string): Promise<void>;
}

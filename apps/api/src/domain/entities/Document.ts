// apps/api/src/domain/entities/Document.ts
import { generateId } from "@faninitiative/shared";

export type DocumentCategory =
  | "satzung"
  | "protokolle"
  | "formulare"
  | "richtlinien"
  | "guides";
export type DocumentStatus = "current" | "outdated" | "draft";
export type DocumentType =
  | "document" // PDFs, Word, etc.
  | "image" // JPG, PNG, etc.
  | "spreadsheet" // Excel, Sheets
  | "form" // Ausfüllbare Formulare
  | "other";

/**
 * Document Entity
 * @description Represents a document stored in Google Drive
 */
export class Document {
  constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly description: string,
    public readonly category: DocumentCategory,
    public readonly googleDriveFileId: string,
    public readonly fileUrl: string,
    public readonly fileSize: number,
    public readonly fileType: string,
    public readonly version: string,
    public readonly status: DocumentStatus,
    public readonly isPublic: boolean,
    public readonly createdBy: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly downloads: number = 0,
    public readonly documentType: DocumentType,
    public readonly folderPath: string,
  ) {}

  static create(params: {
    title: string;
    description: string;
    category: DocumentCategory;
    googleDriveFileId: string;
    fileUrl: string;
    fileSize: number;
    fileType: string;
    version: string;
    isPublic: boolean;
    createdBy: string;
    documentType: DocumentType;
    folderPath: string;
  }): Document {
    const now = new Date();
    return new Document(
      generateId(),
      params.title,
      params.description,
      params.category,
      params.googleDriveFileId,
      params.fileUrl,
      params.fileSize,
      params.fileType,
      params.version,
      "current",
      params.isPublic,
      params.createdBy,
      now,
      now,
      0,
      params.documentType,
      params.folderPath,
    );
  }

  static fromDatabase(row: any): Document {
    return new Document(
      row.id,
      row.title,
      row.description,
      row.category,
      row.googleDriveFileId,
      row.file_url,
      row.file_size,
      row.file_type,
      row.version,
      row.status,
      row.isPublic,
      row.created_by,
      new Date(row.createdAt),
      new Date(row.updatedAt),
      row.downloads || 0,
      row.document_type || "document",
      row.folder_path || "",
    );
  }

  canBeAccessedBy(userId?: string): boolean {
    return this.isPublic || !!userId;
  }

  /**
   * Helper für Datei-Icons im Frontend
   */
  getFileIcon(): string {
    const iconMap: Record<string, string> = {
      "application/pdf": "file-pdf",
      "image/jpeg": "file-image",
      "image/png": "file-image",
      "application/vnd.ms-excel": "file-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
        "file-excel",
      "application/msword": "file-word",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        "file-word",
    };

    return iconMap[this.fileType] || "file";
  }

  /**
   * Determine document type from MIME type
   */
  static getDocumentType(mimeType: string): DocumentType {
    if (mimeType.startsWith("image/")) return "image";
    if (mimeType.includes("spreadsheet") || mimeType.includes("excel"))
      return "spreadsheet";
    if (
      mimeType.includes("pdf") ||
      mimeType.includes("document") ||
      mimeType.includes("word")
    )
      return "document";
    if (mimeType.includes("form")) return "form";
    return "other";
  }

  toJSON() {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      category: this.category,
      fileUrl: this.fileUrl,
      fileSize: this.fileSize,
      fileType: this.fileType,
      version: this.version,
      status: this.status,
      isPublic: this.isPublic,
      downloads: this.downloads,
      documentType: this.documentType,
      folderPath: this.folderPath,
      fileIcon: this.getFileIcon(),
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
    };
  }
}

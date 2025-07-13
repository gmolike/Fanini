// apps/api/src/application/use-cases/UploadDocumentUseCase.ts
import { GoogleDriveService } from "@/infrastructure/services/GoogleDriveService";
import { Document, DocumentCategory } from "@/domain/entities/Document";
import { IDocumentRepository } from "@/domain/repositories/IDocumentRepository";
import { logger } from "@/infrastructure/services/LoggerService";

export class UploadDocumentUseCase {
  constructor(
    private readonly documentRepository: IDocumentRepository,
    private readonly googleDriveService: GoogleDriveService,
  ) {}

  async execute(params: {
    title: string;
    description: string;
    category: DocumentCategory;
    fileBuffer: Buffer;
    fileName: string;
    mimeType: string;
    version: string;
    isPublic: boolean;
    userId: string;
    userName?: string; // NEU
    ipAddress?: string; // NEU
  }): Promise<Document> {
    const startTime = Date.now();

    logger.info("Starting document upload", {
      userId: params.userId,
      action: "upload_document",
      resource: "document",
      metadata: {
        fileName: params.fileName,
        category: params.category,
        fileSize: params.fileBuffer.length,
        isPublic: params.isPublic,
      },
    });

    try {
      // Ensure folder structure exists
      const folders = await this.googleDriveService.ensureFolderStructure();
      const folderId = folders[params.category];

      // Upload to Google Drive
      logger.debug("Uploading to Google Drive", {
        userId: params.userId,
        action: "google_drive_upload",
        metadata: { folderId, fileName: params.fileName },
      });

      const uploadResult = await this.googleDriveService.uploadFile({
        fileName: params.fileName,
        mimeType: params.mimeType,
        fileContent: params.fileBuffer,
        folderId,
        isPublic: params.isPublic,
      });

      // Create document entity
      const document = Document.create({
        title: params.title,
        description: params.description,
        category: params.category,
        googleDriveFileId: uploadResult.fileId,
        fileUrl: uploadResult.downloadLink,
        fileSize: params.fileBuffer.length,
        fileType: params.mimeType,
        version: params.version,
        isPublic: params.isPublic,
        createdBy: params.userId,
        documentType: Document.getDocumentType(params.mimeType),
        folderPath: folders[params.category],
      });

      // Save to database
      const savedDocument = await this.documentRepository.save(document);

      const duration = Date.now() - startTime;
      logger.info("Document upload successful", {
        userId: params.userId,
        action: "upload_document_success",
        resource: "document",
        resourceId: savedDocument.id,
        metadata: {
          googleDriveFileId: uploadResult.fileId,
          duration,
          fileSize: params.fileBuffer.length,
          userName: params.userName,
          ipAddress: params.ipAddress,
        },
      });

      // TODO: Save to upload_logs table
      // await this.uploadLogRepository.save(uploadLog);

      return savedDocument;
    } catch (error) {
      const duration = Date.now() - startTime;
      logger.error("Document upload failed", {
        userId: params.userId,
        action: "upload_document_error",
        resource: "document",
        metadata: {
          error: error instanceof Error ? error.message : "Unknown error",
          fileName: params.fileName,
          duration,
          userName: params.userName,
          ipAddress: params.ipAddress,
        },
      });

      throw new Error("Failed to upload document");
    }
  }
}

// apps/api/src/application/use-cases/UploadDocumentUseCase.ts
import { GoogleDriveService } from '@/infrastructure/services/GoogleDriveService';
import { Document, DocumentCategory } from '@/domain/entities/Document';
import { IDocumentRepository } from '@/domain/repositories/IDocumentRepository';

export class UploadDocumentUseCase {
  constructor(
    private readonly documentRepository: IDocumentRepository,
    private readonly googleDriveService: GoogleDriveService
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
  }): Promise<Document> {
    try {
      // Ensure folder structure exists
      const folders = await this.googleDriveService.ensureFolderStructure();
      const folderId = folders[params.category];

      // Upload to Google Drive
      const uploadResult = await this.googleDriveService.uploadFile({
        fileName: params.fileName,
        mimeType: params.mimeType,
        fileContent: params.fileBuffer,
        folderId,
        isPublic: params.isPublic
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
        documentType: params.category as any, // Replace 'as any' with correct mapping if needed
        folderPath: folders[params.category] // Or provide the correct folder path string
      });

      // Save to database
      return await this.documentRepository.save(document);
    } catch (error) {
      console.error('Upload document error:', error);
      throw new Error('Failed to upload document');
    }
  }
}

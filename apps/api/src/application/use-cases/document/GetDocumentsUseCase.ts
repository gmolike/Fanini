// apps/api/src/application/use-cases/GetDocumentsUseCase.ts
import { Document } from "@/domain/entities/Document";
import { DocumentFilters, IDocumentRepository } from "@/domain/repositories/IDocumentRepository";

export class GetDocumentsUseCase {
  constructor(private readonly documentRepository: IDocumentRepository) {}

  async execute(params: {
    filters?: DocumentFilters;
    userId?: string;
  }): Promise<Document[]> {
    const filters = params.filters || {};

    // If no user, only show public documents
    if (!params.userId) {
      filters.isPublic = true;
    }

    return await this.documentRepository.findAll(filters);
  }

  async executeById(params: {
    id: string;
    userId?: string;
  }): Promise<Document | null> {
    const document = await this.documentRepository.findById(params.id);

    if (!document) return null;

    // Check access rights
    if (!document.canBeAccessedBy(params.userId)) {
      throw new Error("Unauthorized to access this document");
    }

    // Increment download counter
    await this.documentRepository.updateDownloadCount(params.id);

    return document;
  }
}

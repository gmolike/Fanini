// src/infrastructure/di/slices/documentSlice.ts
import { Container } from "../container";
import {
  GetDocumentsUseCase,
  UploadDocumentUseCase,
} from "@/application/use-cases/document";
import { DocumentController } from "@/presentation/controllers";
import { MySQLDocumentRepository } from "@/infrastructure/repositories/MySQLDocumentRepository";

export const registerDocumentSlice = (container: Container) => {
  container.register("DocumentRepository", () => {
    const db = container.get("Database");
    const googleDrive = container.get("GoogleDriveService");
    return new MySQLDocumentRepository(db, googleDrive);
  });

  container.register("GetDocumentsUseCase", () => {
    const repo = container.get("DocumentRepository");
    return new GetDocumentsUseCase(repo);
  });

  container.register("UploadDocumentUseCase", () => {
    const repo = container.get("DocumentRepository");
    const googleDrive = container.get("GoogleDriveService");
    return new UploadDocumentUseCase(repo, googleDrive);
  });

  container.register("DocumentController", () => {
    const getDocuments = container.get("GetDocumentsUseCase");
    return new DocumentController(getDocuments);
  });
};

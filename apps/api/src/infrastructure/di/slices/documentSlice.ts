// apps/api/src/infrastructure/di/slices/documentSlice.ts
import type { Container } from "../container";
import {
} from "@/application/use-cases/document";
import { createDocumentController } from "@/presentation/controllers/document/DocumentController";
import { createMySQLDocumentRepository } from "@/infrastructure/repositories/document/MySQLDocumentRepository";

export const registerDocumentSlice = (container: Container): void => {
  container.register("DocumentRepository", () => {
    const db = container.get("Database");
    const googleDrive = container.get("GoogleDriveService");
    return createMySQLDocumentRepository(db, googleDrive);
  });

  container.register("GetPublicDocumentsUseCase", () => {
    const repo = container.get("DocumentRepository");
    return createGetDocumentsUseCase(repo);
  });

  container.register("GetInternalDocumentsUseCase", () => {
    const repo = container.get("DocumentRepository");
    const permissionService = container.get("PermissionService");
    return createGetDocumentsUseCase(repo, permissionService);
  });

  container.register("DeleteDocumentUseCase", () => {
    const repo = container.get("DocumentRepository");
    const permissionService = container.get("PermissionService");
    const googleDrive = container.get("GoogleDriveService");
    return createDeleteDocumentUseCase(repo, permissionService, googleDrive);
  });

  container.register("DocumentController", () => {
    const getPublicDocuments = container.get("GetPublicDocumentsUseCase");
    const getInternalDocuments = container.get("GetInternalDocumentsUseCase");
    const deleteDocument = container.get("DeleteDocumentUseCase");
    return createDocumentController(
      getPublicDocuments,
      getInternalDocuments,
      deleteDocument,
    );
  });
};

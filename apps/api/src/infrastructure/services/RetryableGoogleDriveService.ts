// apps/api/src/infrastructure/services/RetryableGoogleDriveService.ts
import { GoogleDriveService } from "./GoogleDriveService";

/**
 * Decorator for retry logic
 */
const withRetry = async <T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000,
): Promise<T> => {
  let lastError: Error | null = null;

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;

      // Don't retry on client errors (4xx)
      if (error instanceof Error && error.message.includes("4")) {
        throw error;
      }

      // Wait before retry
      if (i < maxRetries - 1) {
        await new Promise((resolve) =>
          setTimeout(resolve, delay * Math.pow(2, i)),
        );
      }
    }
  }

  throw lastError || new Error("Operation failed after retries");
};

/**
 * Google Drive Service with retry logic
 */
export class RetryableGoogleDriveService extends GoogleDriveService {
  async uploadFile(params: Parameters<GoogleDriveService["uploadFile"]>[0]) {
    return withRetry(() => super.uploadFile(params));
  }

  async getFile(fileId: string) {
    return withRetry(() => super.getFile(fileId));
  }

  async listFiles(params: Parameters<GoogleDriveService["listFiles"]>[0]) {
    return withRetry(() => super.listFiles(params));
  }

  async deleteFile(fileId: string) {
    return withRetry(() => super.deleteFile(fileId));
  }

  async createFolder(name: string, parentId?: string) {
    return withRetry(() => super.createFolder(name, parentId));
  }

  // DIESE BEIDEN METHODEN FEHLTEN!
  async ensureFolderStructure() {
    return withRetry(() => super.ensureFolderStructure());
  }

  async createEventFolder(eventDate: Date, eventName: string) {
    return withRetry(() => super.createEventFolder(eventDate, eventName));
  }
}

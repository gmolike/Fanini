// apps/api/src/domain/entities/UploadLog.ts
import { generateId } from "@faninitiative/shared";

export type UploadType = "document" | "image" | "event_photo" | "profile_image";
export type UploadStatus = "success" | "failed";

/**
 * Upload Log Entity
 * @description Protokolliert alle Upload-Aktivitäten
 */
export class UploadLog {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly userName: string,
    public readonly fileName: string,
    public readonly fileType: string,
    public readonly fileSize: number,
    public readonly uploadType: UploadType,
    public readonly googleDriveFileId: string | null,
    public readonly folderId: string,
    public readonly status: UploadStatus,
    public readonly errorMessage: string | null,
    public readonly uploadedAt: Date,
    public readonly ipAddress: string | null,
  ) {}

  static create(params: {
    userId: string;
    userName: string;
    fileName: string;
    fileType: string;
    fileSize: number;
    uploadType: UploadType;
    googleDriveFileId: string | null;
    folderId: string;
    status: UploadStatus;
    errorMessage?: string;
    ipAddress?: string;
  }): UploadLog {
    return new UploadLog(
      generateId(),
      params.userId,
      params.userName,
      params.fileName,
      params.fileType,
      params.fileSize,
      params.uploadType,
      params.googleDriveFileId,
      params.folderId,
      params.status,
      params.errorMessage || null,
      new Date(),
      params.ipAddress || null,
    );
  }
}

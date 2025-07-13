// apps/api/src/application/use-cases/UploadEventPhotosUseCase.ts
import { GoogleDriveService } from '@/infrastructure/services/GoogleDriveService';
import { IEventRepository } from '@/domain/repositories/IEventRepository';

export class UploadEventPhotosUseCase {
  constructor(
    private googleDriveService: GoogleDriveService,
    private eventRepository: IEventRepository
  ) {}

  async execute(params: {
    eventId: string;
    photos: Array<{
      fileName: string;
      mimeType: string;
      buffer: Buffer;
    }>;
    userId: string;
  }): Promise<Array<{
    fileId: string;
    url: string;
    thumbnailUrl?: string;
  }>> {
    // Get event
    const event = await this.eventRepository.findById(params.eventId);
    if (!event) {
      throw new Error('Event not found');
    }

    // Check permissions
    if (!event.canBeEditedBy(params.userId)) {
      throw new Error('Unauthorized to upload photos for this event');
    }

    // Create event folder structure
    const eventFolders = await this.googleDriveService.createEventFolder(
      event.date,
      event.title
    );

    // Upload photos
    const results = [];
    for (const photo of params.photos) {
      try {
        // Generate unique filename with timestamp
        const timestamp = Date.now();
        const fileExt = photo.fileName.split('.').pop();
        const uniqueFileName = `${timestamp}_${photo.fileName}`;

        const result = await this.googleDriveService.uploadFile({
          fileName: uniqueFileName,
          mimeType: photo.mimeType,
          fileContent: photo.buffer,
          folderId: eventFolders.subFolders.fotos,
          isPublic: event.istOeffentlich // Use event's public status
        });

        results.push({
          fileId: result.fileId,
          url: result.downloadLink,
          thumbnailUrl: this.generateThumbnailUrl(result.fileId)
        });
      } catch (error) {
        console.error(`Failed to upload photo ${photo.fileName}:`, error);
        // Continue with other photos even if one fails
      }
    }

    if (results.length === 0) {
      throw new Error('Failed to upload any photos');
    }

    return results;
  }

  /**
   * Generate thumbnail URL for Google Drive images
   */
  private generateThumbnailUrl(fileId: string): string {
    // Google Drive thumbnail URL pattern
    return `https://drive.google.com/thumbnail?id=${fileId}&sz=w400`;
  }
}

// apps/api/src/infrastructure/services/GoogleDriveService.ts
import { google, drive_v3 } from "googleapis";
import { JWT } from "google-auth-library";

export type FolderCategory =
  | "dokumente/satzung"
  | "dokumente/protokolle"
  | "dokumente/formulare"
  | "dokumente/richtlinien"
  | "dokumente/guides"
  | "events"
  | "medien/logos"
  | "medien/team-fotos"
  | "medien/social-media"
  | "medien/galerie"
  | "listen"
  | "archiv";

/**
 * Google Drive Service mit Service Account
 * @description Handles all interactions with Google Drive API using Service Account
 */
export class GoogleDriveService {
  private drive: drive_v3.Drive;
  private auth: JWT;

  constructor() {
    // Service Account Authentication
    const serviceAccountKey = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;

    if (!serviceAccountKey) {
      throw new Error("Google Service Account Key not configured");
    }

    // Parse the service account key
    const credentials = JSON.parse(serviceAccountKey);

    this.auth = new JWT({
      email: credentials.client_email,
      key: credentials.private_key,
      scopes: ["https://www.googleapis.com/auth/drive"],
    });

    this.drive = google.drive({ version: "v3", auth: this.auth });
  }

  /**
   * Initialize authentication
   */
  private async ensureAuthenticated(): Promise<void> {
    try {
      await this.auth.authorize();
    } catch (error) {
      console.error("Authentication failed:", error);
      throw new Error("Failed to authenticate with Google Drive");
    }
  }

  /**
   * Upload file to Google Drive
   */
  async uploadFile(params: {
    fileName: string;
    mimeType: string;
    fileContent: Buffer;
    folderId?: string;
    isPublic?: boolean;
  }): Promise<{ fileId: string; webViewLink: string; downloadLink: string }> {
    try {
      // Ensure we're authenticated
      await this.ensureAuthenticated();

      const fileMetadata: drive_v3.Schema$File = {
        name: params.fileName,
        parents: params.folderId
          ? [params.folderId]
          : [process.env.GOOGLE_DRIVE_ROOT_FOLDER_ID!],
      };

      const media = {
        mimeType: params.mimeType,
        body: params.fileContent,
      };

      const response = await this.drive.files.create({
        requestBody: fileMetadata,
        media: media,
        fields: "id, webViewLink",
      });

      if (!response.data.id) {
        throw new Error("Failed to upload file - no ID returned");
      }

      // Set permissions if public
      if (params.isPublic) {
        await this.makeFilePublic(response.data.id);
      }

      return {
        fileId: response.data.id,
        webViewLink: response.data.webViewLink || "",
        downloadLink: `https://drive.google.com/uc?export=download&id=${response.data.id}`,
      };
    } catch (error) {
      console.error("Google Drive upload error:", error);
      throw new Error("Failed to upload file to Google Drive");
    }
  }

  /**
   * Get file metadata
   */
  async getFile(fileId: string): Promise<drive_v3.Schema$File> {
    try {
      await this.ensureAuthenticated();

      const response = await this.drive.files.get({
        fileId,
        fields:
          "id, name, mimeType, size, webViewLink, createdTime, modifiedTime",
      });

      return response.data;
    } catch (error) {
      console.error("Google Drive get file error:", error);
      throw new Error("Failed to get file from Google Drive");
    }
  }

  /**
   * Delete file from Google Drive
   */
  async deleteFile(fileId: string): Promise<void> {
    try {
      await this.ensureAuthenticated();
      await this.drive.files.delete({ fileId });
    } catch (error) {
      console.error("Google Drive delete error:", error);
      throw new Error("Failed to delete file from Google Drive");
    }
  }

  /**
   * List files in a folder
   */
  async listFiles(params: {
    folderId?: string;
    pageSize?: number;
    pageToken?: string;
  }): Promise<{
    files: drive_v3.Schema$File[];
    nextPageToken?: string;
  }> {
    try {
      await this.ensureAuthenticated();

      const folderId =
        params.folderId || process.env.GOOGLE_DRIVE_ROOT_FOLDER_ID!;
      const query = `'${folderId}' in parents and trashed = false`;

      const response = await this.drive.files.list({
        q: query,
        pageSize: params.pageSize || 20,
        pageToken: params.pageToken,
        fields:
          "nextPageToken, files(id, name, mimeType, size, webViewLink, createdTime)",
      });

      return {
        files: response.data.files || [],
        nextPageToken: response.data.nextPageToken || undefined,
      };
    } catch (error) {
      console.error("Google Drive list error:", error);
      throw new Error("Failed to list files from Google Drive");
    }
  }

  /**
   * Create folder in Google Drive
   */
  async createFolder(name: string, parentId?: string): Promise<string> {
    try {
      await this.ensureAuthenticated();

      const fileMetadata: drive_v3.Schema$File = {
        name,
        mimeType: "application/vnd.google-apps.folder",
        parents: parentId
          ? [parentId]
          : [process.env.GOOGLE_DRIVE_ROOT_FOLDER_ID!],
      };

      const response = await this.drive.files.create({
        requestBody: fileMetadata,
        fields: "id",
      });

      if (!response.data.id) {
        throw new Error("Failed to create folder - no ID returned");
      }

      return response.data.id;
    } catch (error) {
      console.error("Google Drive create folder error:", error);
      throw new Error("Failed to create folder in Google Drive");
    }
  }

  /**
   * Make file publicly accessible
   */
  private async makeFilePublic(fileId: string): Promise<void> {
    await this.drive.permissions.create({
      fileId,
      requestBody: {
        role: "reader",
        type: "anyone",
      },
    });
  }

  /**
   * Helper: Ensure folder exists or create it
   */
  private async ensureFolder(name: string, parentId: string): Promise<string> {
    const query = `name = '${name}' and '${parentId}' in parents and mimeType = 'application/vnd.google-apps.folder' and trashed = false`;

    const response = await this.drive.files.list({
      q: query,
      fields: "files(id)",
    });

    if (response.data.files && response.data.files.length > 0) {
      return response.data.files[0].id!;
    }

    return await this.createFolder(name, parentId);
  }

  /**
   * Get or create complete folder structure
   */
  async ensureFolderStructure(): Promise<Record<string, string>> {
    await this.ensureAuthenticated();

    const folders: Record<string, string> = {};
    const rootFolderId = process.env.GOOGLE_DRIVE_ROOT_FOLDER_ID!;

    // Haupt-Ordner
    const mainFolders = {
      dokumente: await this.ensureFolder("dokumente", rootFolderId),
      events: await this.ensureFolder("events", rootFolderId),
      medien: await this.ensureFolder("medien", rootFolderId),
      listen: await this.ensureFolder("listen", rootFolderId),
      archiv: await this.ensureFolder("archiv", rootFolderId),
    };

    // Dokumente Unter-Ordner
    folders["dokumente/satzung"] = await this.ensureFolder(
      "satzung",
      mainFolders.dokumente,
    );
    folders["dokumente/protokolle"] = await this.ensureFolder(
      "protokolle",
      mainFolders.dokumente,
    );
    folders["dokumente/formulare"] = await this.ensureFolder(
      "formulare",
      mainFolders.dokumente,
    );
    folders["dokumente/richtlinien"] = await this.ensureFolder(
      "richtlinien",
      mainFolders.dokumente,
    );
    folders["dokumente/guides"] = await this.ensureFolder(
      "guides",
      mainFolders.dokumente,
    );

    // Medien Unter-Ordner
    folders["medien/logos"] = await this.ensureFolder(
      "logos",
      mainFolders.medien,
    );
    folders["medien/team-fotos"] = await this.ensureFolder(
      "team-fotos",
      mainFolders.medien,
    );
    folders["medien/social-media"] = await this.ensureFolder(
      "social-media",
      mainFolders.medien,
    );
    folders["medien/galerie"] = await this.ensureFolder(
      "galerie",
      mainFolders.medien,
    );

    // Event-Ordner für aktuelles Jahr
    const currentYear = new Date().getFullYear().toString();
    folders[`events/${currentYear}`] = await this.ensureFolder(
      currentYear,
      mainFolders.events,
    );

    return folders;
  }

  /**
   * Create event folder with subfolders
   */
  async createEventFolder(
    eventDate: Date,
    eventName: string,
  ): Promise<{
    mainFolder: string;
    subFolders: {
      fotos: string;
      dokumente: string;
      abrechnung: string;
    };
  }> {
    await this.ensureAuthenticated();

    const year = eventDate.getFullYear().toString();
    const dateStr = eventDate.toISOString().split("T")[0];
    const folderName = `${dateStr}_${eventName}`;

    // Ensure year folder exists
    const eventsFolderId = await this.ensureFolder(
      "events",
      process.env.GOOGLE_DRIVE_ROOT_FOLDER_ID!,
    );
    const yearFolderId = await this.ensureFolder(year, eventsFolderId);

    // Create event folder
    const eventFolderId = await this.createFolder(folderName, yearFolderId);

    // Create subfolders
    const subFolders = {
      fotos: await this.createFolder("fotos", eventFolderId),
      dokumente: await this.createFolder("dokumente", eventFolderId),
      abrechnung: await this.createFolder("abrechnung", eventFolderId),
    };

    return {
      mainFolder: eventFolderId,
      subFolders,
    };
  }
}

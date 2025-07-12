// apps/api/src/infrastructure/services/GoogleDriveService.ts
import { google, drive_v3 } from "googleapis";
import { JWT } from "google-auth-library";
import { Readable } from "stream";

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

export interface UploadFileParams {
  fileName: string;
  mimeType: string;
  fileContent: Buffer;
  folderId?: string;
  isPublic?: boolean;
}

export interface ListFilesParams {
  folderId?: string;
  pageSize?: number;
  pageToken?: string;
}

export interface UploadResult {
  fileId: string;
  webViewLink: string;
  downloadLink: string;
}

export interface ListFilesResult {
  files: drive_v3.Schema$File[];
  nextPageToken?: string;
}

export interface EventFolderResult {
  mainFolder: string;
  subFolders: {
    fotos: string;
    dokumente: string;
    abrechnung: string;
  };
}

/**
 * Google Drive Service mit Service Account
 * @description Handles all interactions with Google Drive API using Service Account
 */
export class GoogleDriveService {
  protected drive: drive_v3.Drive;
  protected auth: JWT;
  private isAuthenticated = false;

  constructor() {
    console.log("🔧 GoogleDriveService Constructor");

    // Versuche beide Varianten
    let serviceAccountKey = process.env.GOOGLE_SERVICE_ACCOUNT_KEY_BASE64;
    let isBase64 = true;

    if (!serviceAccountKey) {
      // Fallback zu direktem JSON
      serviceAccountKey = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
      isBase64 = false;
    }

    if (!serviceAccountKey) {
      throw new Error(
        "Neither GOOGLE_SERVICE_ACCOUNT_KEY_BASE64 nor GOOGLE_SERVICE_ACCOUNT_KEY is set",
      );
    }

    const rootFolderId = process.env.GOOGLE_DRIVE_ROOT_FOLDER_ID;
    if (!rootFolderId) {
      throw new Error(
        "GOOGLE_DRIVE_ROOT_FOLDER_ID environment variable is not set",
      );
    }

    try {
      // Decode wenn Base64, sonst direkt nutzen
      const jsonString = isBase64
        ? Buffer.from(serviceAccountKey, "base64").toString("utf-8")
        : serviceAccountKey;

      const credentials = JSON.parse(jsonString);

      console.log("✅ Service Account parsed successfully");
      console.log("- Client Email:", credentials.client_email);
      console.log("- Project ID:", credentials.project_id);
      console.log("- Key format:", isBase64 ? "Base64" : "Direct JSON");

      this.auth = new JWT({
        email: credentials.client_email,
        key: credentials.private_key,
        scopes: ["https://www.googleapis.com/auth/drive"],
      });

      this.drive = google.drive({ version: "v3", auth: this.auth });
    } catch (error) {
      console.error("❌ Failed to initialize Google Drive Service:", error);
      throw new Error("Failed to initialize Google Drive Service");
    }
  }

  /**
   * Initialize authentication
   */
  protected async ensureAuthenticated(): Promise<void> {
    if (this.isAuthenticated) return;

    try {
      console.log("🔐 Authenticating with Google Drive...");
      await this.auth.authorize();
      this.isAuthenticated = true;
      console.log("✅ Authentication successful!");
    } catch (error) {
      console.error("❌ Authentication failed:", error);
      throw new Error(
        `Failed to authenticate with Google Drive: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }

  /**
   * Upload file to Google Drive
   */
  // apps/api/src/infrastructure/services/GoogleDriveService.ts
  // Ersetze die komplette uploadFile Methode:

  public async uploadFile(params: UploadFileParams): Promise<UploadResult> {
    try {
      await this.ensureAuthenticated();

      console.log("📤 Starting upload...");
      console.log("- File name:", params.fileName);
      console.log("- MIME type:", params.mimeType);
      console.log("- Buffer length:", params.fileContent?.length || 0);
      console.log("- Is Buffer?:", Buffer.isBuffer(params.fileContent));

      // Test ob wir überhaupt Zugriff haben
      try {
        console.log("🔍 Testing Google Drive access...");
        const testList = await this.drive.files.list({
          pageSize: 1,
          fields: "files(id, name)",
        });
        console.log("✅ Can access Google Drive");
      } catch (testError: any) {
        console.error("❌ Cannot access Google Drive:", testError.message);
        throw testError;
      }

      const fileMetadata: drive_v3.Schema$File = {
        name: params.fileName,
        parents: [process.env.GOOGLE_DRIVE_ROOT_FOLDER_ID!],
      };

      // Versuche verschiedene Stream-Methoden
      let stream;
      try {
        // Methode 1: Readable.from
        stream = Readable.from(params.fileContent);
        console.log("✅ Created stream with Readable.from");
      } catch (e) {
        console.error("❌ Readable.from failed:", e);
        // Methode 2: Manueller Stream
        stream = new Readable();
        stream.push(params.fileContent);
        stream.push(null);
        console.log("✅ Created manual stream");
      }

      const media = {
        mimeType: params.mimeType,
        body: stream,
      };

      console.log("🚀 Calling drive.files.create...");

      let response;
      try {
        response = await this.drive.files.create({
          requestBody: fileMetadata,
          media: media,
          fields: "id, webViewLink",
          supportsAllDrives: true, // NUR diese Zeile hinzufügen!
        });
        console.log("✅ drive.files.create successful");
      } catch (apiError: any) {
        console.error("❌ Google API Error:");
        console.error("- Code:", apiError.code);
        console.error("- Message:", apiError.message);
        console.error("- Errors:", JSON.stringify(apiError.errors, null, 2));
        console.error("- Response:", apiError.response?.data);
        throw apiError;
      }

      if (!response.data.id) {
        throw new Error("No file ID in response");
      }

      console.log("📄 File created with ID:", response.data.id);

      if (params.isPublic) {
        try {
          await this.makeFilePublic(response.data.id);
          console.log("✅ File made public");
        } catch (e) {
          console.error("⚠️ Failed to make public:", e);
        }
      }

      return {
        fileId: response.data.id,
        webViewLink: response.data.webViewLink || "",
        downloadLink: `https://drive.google.com/uc?export=download&id=${response.data.id}`,
      };
    } catch (error: any) {
      console.error("❌ Final catch block error:", error);
      throw error;
    }
  }

  /**
   * Get file metadata
   */
  public async getFile(fileId: string): Promise<drive_v3.Schema$File> {
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
  public async deleteFile(fileId: string): Promise<void> {
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
  public async listFiles(params: ListFilesParams): Promise<ListFilesResult> {
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
  public async createFolder(name: string, parentId?: string): Promise<string> {
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
        supportsAllDrives: true,
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
      supportsAllDrives: true,
    });

    if (response.data.files && response.data.files.length > 0) {
      return response.data.files[0].id!;
    }

    return await this.createFolder(name, parentId);
  }

  /**
   * Get or create complete folder structure
   */
  public async ensureFolderStructure(): Promise<Record<string, string>> {
    await this.ensureAuthenticated();

    const folders: Record<string, string> = {};
    const rootFolderId = process.env.GOOGLE_DRIVE_ROOT_FOLDER_ID!;

    // Prüfe ob wir Zugriff auf den Root-Ordner haben
    try {
      const rootFolder = await this.drive.files.get({
        fileId: rootFolderId,
        fields: "id, name, capabilities",
      });
      console.log("✅ Root folder access confirmed:", rootFolder.data.name);
      console.log(
        "- Can create children:",
        rootFolder.data.capabilities?.canAddChildren,
      );
    } catch (error) {
      console.error("❌ Cannot access root folder:", error);
      throw new Error(
        "No access to the shared folder. Please ensure it is shared with the service account.",
      );
    }

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
  public async createEventFolder(
    eventDate: Date,
    eventName: string,
  ): Promise<EventFolderResult> {
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

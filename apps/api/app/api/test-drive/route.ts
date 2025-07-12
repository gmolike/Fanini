// apps/api/app/api/test-drive/route.ts
import { NextResponse } from "next/server";
import { setupContainer } from "../../../src/infrastructure/di/container";

export async function GET() {
  const diagnostics: any = {
    environment: {
      NODE_ENV: process.env.NODE_ENV,
      serviceAccountKeyExists: !!process.env.GOOGLE_SERVICE_ACCOUNT_KEY,
      rootFolderIdExists: !!process.env.GOOGLE_DRIVE_ROOT_FOLDER_ID,
      rootFolderId: process.env.GOOGLE_DRIVE_ROOT_FOLDER_ID || "NOT_SET",
    },
    serviceAccount: {},
    authentication: {},
    folderStructure: {},
  };

  try {
    // Check Service Account Key
    if (process.env.GOOGLE_SERVICE_ACCOUNT_KEY) {
      try {
        const parsed = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY);
        diagnostics.serviceAccount = {
          valid: true,
          clientEmail: parsed.client_email,
          projectId: parsed.project_id,
          hasPrivateKey: !!parsed.private_key,
        };
      } catch (e) {
        diagnostics.serviceAccount = {
          valid: false,
          error: "Invalid JSON format",
        };
      }
    } else {
      diagnostics.serviceAccount = {
        valid: false,
        error: "GOOGLE_SERVICE_ACCOUNT_KEY not set",
      };
    }

    // Try to initialize service
    if (diagnostics.serviceAccount.valid) {
      try {
        const container = setupContainer();
        const googleDrive = container.get("GoogleDriveService");

        // Test authentication
        diagnostics.authentication = {
          initialized: true,
          status: "Service created successfully",
        };

        // Try to create folder structure
        const folders = await googleDrive.ensureFolderStructure();
        diagnostics.folderStructure = {
          success: true,
          foldersCreated: Object.keys(folders).length,
          folders: folders,
        };
      } catch (error: any) {
        diagnostics.authentication = {
          initialized: false,
          error: error.message,
        };
      }
    }

    console.log(
      "🎉 FINAL RESULT:",
      JSON.stringify(
        {
          success: diagnostics.folderStructure.success || false,
          foldersCreated: diagnostics.folderStructure.foldersCreated || 0,
          folders: diagnostics.folderStructure.folders || {},
        },
        null,
        2,
      ),
    );

    return NextResponse.json({
      success: diagnostics.folderStructure.success || false,
      diagnostics,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        diagnostics,
      },
      { status: 500 },
    );
  }
}

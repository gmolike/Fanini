// apps/api/app/api/test-drive/route.ts
import { NextResponse } from "next/server";
import { setupContainer } from "../../../src/infrastructure/di/container";

export async function GET() {
  try {
    const container = setupContainer();
    const googleDrive = container.get("GoogleDriveService");

    // Test: Ordnerstruktur erstellen
    const folders = await googleDrive.ensureFolderStructure();

    return NextResponse.json({
      success: true,
      message: "Google Drive integration working!",
      folders: folders,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 },
    );
  }
}

// apps/api/app/api/documents/upload/route.ts
import { NextRequest, NextResponse } from "next/server";
import { setupContainer } from "../../../../src/infrastructure/di/container";

export async function POST(request: NextRequest) {
  try {
    // Nutze NextRequest's formData() - das ist NICHT deprecated!
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file provided" },
        { status: 400 },
      );
    }

    // File zu Buffer konvertieren
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Metadaten extrahieren
    const metadata = {
      title: formData.get("title") as string,
      description: (formData.get("description") as string) || "",
      category: formData.get("category") as string,
      version: (formData.get("version") as string) || "1.0",
      isPublic: formData.get("isPublic") === "true",
    };

    // DI Container und Use Case
    const container = setupContainer();
    const uploadUseCase = container.get("UploadDocumentUseCase");

    const document = await uploadUseCase.execute({
      ...metadata,
      fileBuffer: buffer,
      fileName: file.name,
      mimeType: file.type,
      userId: "test-user", // TODO: Aus Auth
    });

    return NextResponse.json({
      success: true,
      data: document.toJSON(),
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { success: false, error: "Upload failed" },
      { status: 500 },
    );
  }
}

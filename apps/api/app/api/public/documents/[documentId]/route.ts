// backend/app/api/public/documents/[documentId]/route.ts
import { NextResponse } from "next/server";
import { query } from "@/infrastructure/database/connection";

export async function GET(
  request: Request,
  { params }: { params: { documentId: string } }
) {
  try {
    const documents = await query<any[]>(
      `SELECT
        d.*,
        d.file_url as fileUrl,
        d.file_type as fileType,
        d.file_size as fileSize,
        d.published_at as publishedAt,
        d.updated_at as updatedAt,
        d.is_featured as isFeatured
      FROM documents d
      WHERE d.id = ?`,
      [params.documentId]
    );

    if (documents.length === 0) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }

    const doc = documents[0];

    // Get tags
    const tags = await query<any[]>(
      `SELECT tag FROM document_tags WHERE document_id = ?`,
      [params.documentId]
    );

    // Increment download counter
    await query(
      `UPDATE documents SET downloads = downloads + 1 WHERE id = ?`,
      [params.documentId]
    );

    return NextResponse.json({
      data: {
        ...doc,
        fileSize: Number(doc.fileSize),
        downloads: Number(doc.downloads),
        tags: tags.map(t => t.tag),
      },
    });
  } catch (error) {
    console.error("Document Detail Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

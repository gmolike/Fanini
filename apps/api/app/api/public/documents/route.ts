// backend/app/api/public/documents/route.ts
import { NextResponse } from "next/server";
import { query } from "@/infrastructure/database/connection";
import { z } from "zod";

const documentListItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  category: z.enum(['satzung', 'protokolle', 'formulare', 'richtlinien', 'guides']),
  fileType: z.string(),
  fileSize: z.number(),
  version: z.string(),
  publishedAt: z.string(),
  status: z.enum(['current', 'outdated', 'draft']),
  preview: z.string().optional(),
});

/**
 * @swagger
 * /api/public/documents:
 *   get:
 *     summary: Liste aller öffentlichen Dokumente
 *     tags: [Documents]
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/DocumentListItem'
 *                 meta:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: number
 *                     categories:
 *                       type: array
 *                       items:
 *                         type: string
 */
export async function GET() {
  try {
    const documents = await query<any[]>(
      `SELECT
        d.id,
        d.title,
        d.category,
        d.file_type as fileType,
        d.file_size as fileSize,
        d.version,
        d.published_at as publishedAt,
        d.status,
        CONCAT(LEFT(d.description, 100), '...') as preview
      FROM documents d
      WHERE d.status = 'current'
      ORDER BY d.is_featured DESC, d.published_at DESC`
    );

    const categories = await query<any[]>(
      `SELECT DISTINCT category FROM documents WHERE status = 'current'`
    );

    return NextResponse.json({
      data: documents.map(doc => ({
        ...doc,
        fileSize: Number(doc.fileSize),
      })),
      meta: {
        total: documents.length,
        categories: categories.map(c => c.category),
      },
    });
  } catch (error) {
    console.error("Documents Error:", error);
    return NextResponse.json({
      data: [],
      meta: { total: 0, categories: [] }
    });
  }
}

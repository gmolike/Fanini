// app/api/public/newsletter/list/route.ts
import { NextResponse } from "next/server";

/**
 * GET /api/public/newsletter/list
 * Retrieve list of newsletters
 */
export async function GET() {
  try {
    // TODO: Implement database query
    const newsletters = [
      {
        id: "1",
        titel: "Vereinsnews Januar 2024",
        betreff: "Neues Jahr, neue Events!",
        vorschau:
          "Liebe Mitglieder, wir starten mit vielen neuen Events ins Jahr...",
        versendetAm: new Date().toISOString(),
      },
    ];

    return NextResponse.json({
      success: true,
      data: newsletters,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch newsletters" },
      { status: 500 },
    );
  }
}

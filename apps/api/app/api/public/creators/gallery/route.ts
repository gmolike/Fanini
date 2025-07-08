// app/api/public/creators/gallery/route.ts
import { NextResponse } from "next/server";

/**
 * GET /api/public/creators/gallery
 * Retrieve all public works for gallery display
 */
export async function GET() {
  try {
    // TODO: Implement database query
    const gallery = [
      {
        id: "1",
        creatorId: "1",
        creatorName: "Max Artist",
        titel: "Kunstwerk 1",
        typ: "BILD",
        dateiUrl: "/images/work1.jpg",
        thumbnailUrl: "/images/work1_thumb.jpg",
      },
    ];

    return NextResponse.json({
      success: true,
      data: gallery,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch gallery" },
      { status: 500 },
    );
  }
}

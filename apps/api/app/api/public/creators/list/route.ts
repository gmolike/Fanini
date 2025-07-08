// app/api/public/creators/list/route.ts
import { NextResponse } from "next/server";

/**
 * GET /api/public/creators/list
 * Retrieve list of all public creators
 */
export async function GET() {
  try {
    // TODO: Implement database query
    const creators = [
      {
        id: "1",
        kuenstlername: "Max Artist",
        profiltext: "Künstler aus Berlin",
        istAktiv: true,
      },
    ];

    return NextResponse.json({
      success: true,
      data: creators,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch creators" },
      { status: 500 },
    );
  }
}

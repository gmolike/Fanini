// app/api/public/team-history/years/route.ts
import { NextResponse } from "next/server";

/**
 * GET /api/public/team-history/years
 * Retrieve available years for team history
 */
export async function GET() {
  try {
    // TODO: Implement database query
    const years = [2024, 2023, 2022, 2021, 2020];

    return NextResponse.json({
      success: true,
      data: years,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch years" },
      { status: 500 },
    );
  }
}

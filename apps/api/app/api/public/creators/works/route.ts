// app/api/public/creators/[creatorId]/works/route.ts
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

type Params = {
  params: {
    creatorId: string;
  };
};

/**
 * GET /api/public/creators/{creatorId}/works
 * Retrieve creator's works with pagination
 */
export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { creatorId } = params;
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    // TODO: Implement database query with pagination
    const works = {
      data: [
        {
          id: "1",
          creatorId,
          titel: "Kunstwerk 1",
          typ: "BILD",
          dateiUrl: "/images/work1.jpg",
        },
      ],
      pagination: {
        page,
        limit,
        total: 1,
        totalPages: 1,
      },
    };

    return NextResponse.json({
      success: true,
      ...works,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch works" },
      { status: 500 },
    );
  }
}

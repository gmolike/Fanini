// app/api/public/creators/[creatorId]/route.ts
import { NextResponse } from 'next/server';

type Params = {
  params: {
    creatorId: string;
  };
};

/**
 * GET /api/public/creators/{creatorId}
 * Retrieve specific creator details
 */
export async function GET(request: Request, { params }: Params) {
  try {
    const { creatorId } = params;

    // TODO: Implement database query
    const creator = {
      id: creatorId,
      kuenstlername: 'Max Artist',
      profiltext: 'Künstler aus Berlin',
      portfolioLink: 'https://portfolio.example.com',
      istAktiv: true,
      aktivSeit: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      data: creator,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Creator not found' },
      { status: 404 }
    );
  }
}
